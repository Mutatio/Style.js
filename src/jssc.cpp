/**
 * @author Martin Gallagher <martin@martinpaulgallagher.com>
 */

#include <dirent.h>
#include <vector>
#include "jss.hpp"

int main(int argc, char* argv[]) {
	if (argc > 1) {
		bool compile = false;
		bool processDirectory = false;
		bool printOutput = false;
		bool saveOutput = false;
		bool useExternalJSSFile = false;
		char c;
		unsigned short i;
		unsigned short directoryFilesCount;
		char* CSSFilename;
		ofstream CSSFile;
		string contents;
		string JSS;
		vector<string> directoryFiles;

		while ((c = getopt(argc, argv, "o:j:d:phv")) != -1) {
			switch (c) {
				case 'o':
					if (optarg != NULL) {
						// Cache output filename
						CSSFilename = optarg;

						// Open file file writing and truncate contents
						CSSFile.open(CSSFilename, ios::out | ios::trunc);

						saveOutput = CSSFile.is_open();

						if (!saveOutput) {
							cerr << "The CSS output file isn't writable!\n";

							return 0;
						} else {
							break;
						}
					}

					return 0;

				case 'd':
					processDirectory = true;
					DIR* dir;
					dir = opendir(optarg);

					if (dir == NULL) {
						cerr << "Unable to open directory!";

						return 0;
					} else {
						struct dirent* file;
						char* pos;
						stringstream in;
						string directory;
						string filename;

						in << optarg << "/";
						in >> directory;

						// Clear stream
						in.clear();

						while ((file = readdir(dir)) != NULL) {
							// Ignore self "." and parent ".." directories
							if (strcmp(file->d_name, ".") != 0 && strcmp(file->d_name, "..") != 0) {
								pos = strstr(file->d_name, ".js");

								if (pos != NULL) {
									if (strcmp(pos, ".js") == 0) {
										in << directory << file->d_name;
										in >> filename;
										in.clear();

										// Push filename for suspected JSS compatible file
										directoryFiles.push_back(filename);
									}
								}
							}
						}

						// Free directory object
						closedir(dir);

						// Cache directory files count
						directoryFilesCount = directoryFiles.size();

						if (directoryFilesCount == 0) {
							cerr << "No files found in the directory provided!\n";

							return 0;
						}
					}

					break;

				case 'j':
					if (optarg != NULL) {
						// Override embedded JSS JavaScript with external file
						contents = jss::File::getContents(optarg);

						if (!contents.empty()) {
							JSS = contents + JSS;
							useExternalJSSFile = true;

							break;
						} else {
							cout << "ERROR: Empty external JSS file supplied!\n";
						}
					}

					return 0;

				case 'p':
					// Print CSS output
					printOutput = true;

					break;

				case 'v':
					cout << jss::getVersionString() << "\n\nCompiled " << __DATE__ << " at " << __TIME__ << "\n";

					return 0;

				case 'h':
					cout << "Usage: jssc [options] file...\n"
							"Options:\n"
							"  -j <file>                Override embedded JSS with the contents of <file>\n"
							"  -o <file>                Place CSS output into <file>\n"
							"  -p                       Print CSS output to screen\n"
							"  -v                       Display JSS and JSSC versions\n";

					return 0;
			}
		}

		if (!processDirectory) {
			for (i = optind; i < argc; ++i) {
				contents = jss::File::getContents(argv[i]);

				if (!contents.empty()) {
					JSS += contents;

					if (!compile) {
						compile = true;
					}
				}
			}
		}

		if (compile || processDirectory) {
			// Compile CSS, reuse JSS variable
			if (!useExternalJSSFile) {
				JSS = jss::getJS() + "\n\n" + JSS;
			}

			// Initiate "compiler"
			jss::Compiler JSSCompiler;

			if (!processDirectory) {
				JSS = JSSCompiler.compile(JSS + "\ntoCSS();");

				if (saveOutput) {
					CSSFile << JSS;

					if (printOutput) {
						cout << JSS << "\n";
					} else {
						cout << "CSS output (" << JSS.length() << " bytes) saved to: " << CSSFilename << "\n";
					}
				} else {
					cout << JSS << "\n";
				}
			} else {
				unsigned short count = 0;

				for (i = 0; i < directoryFilesCount; ++i) {
					contents = jss::File::getContents(directoryFiles[i]);

					if (!contents.empty()) {
						JSS = JSSCompiler.compile(JSS + "\n" + contents + "\ntoCSS();");

						if (!JSS.empty()) {
							CSSFile.open(jss::String::toChar(directoryFiles[i] + ".css"), ios::out | ios::trunc);

							if (CSSFile.is_open()) {
								CSSFile << JSS;

								++count;
							}

							CSSFile.close();
						}
					}
				}

				cout << "Found " << directoryFilesCount << " files, " << count << " processed.\n";
			}
		} else {
			cerr << "No valid files were found to transform!\n";
		}

		// Cleanup CSS output file handle
		if (CSSFile.is_open()) {
			CSSFile.close();
		}
	} else {
		cerr << "Please provide at least one file to compile to CSS.\n";
	}

	return 0;
}