/**
 * @author Martin Gallagher <martin@martinpaulgallagher.com>
 */

#include "stylejs.hpp"

int main(int argc, char* argv[]) {
	if (argc > 1) {
		bool compile = false;
		bool printOutput = false;
		bool saveOutput = false;
		bool useExternalStyle = false;
		char c;
		unsigned short i;
		char* CSSFilename;
		ofstream CSSFile;
		string contents;
		string StyleJS;

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

				case 's':
					if (optarg != NULL) {
						// Override embedded Style.js JavaScript with external file
						contents = stylejs::File::getContents(optarg);

						if (!contents.empty()) {
							StyleJS = contents + StyleJS;
							useExternalStyle = true;

							break;
						} else {
							cout << "ERROR: Empty external Style.js file supplied!\n";
						}
					}

					return 0;

				case 'p':
					// Print CSS output
					printOutput = true;

					break;

				case 'v':
					stylejs::About about;

					cout << about.getVersionString() << "\n\nCompiled " << __DATE__ << " at " << __TIME__ << "\n";

					return 0;

				case 'h':
					cout << "Usage: stylec [options] file...\n"
							"Options:\n"
							"  -s <file>                Override embedded Style.js with the contents of <file>\n"
							"  -o <file>                Place CSS output into <file>\n"
							"  -p                       Print CSS output to screen\n"
							"  -v                       Display Style.js and stylec versions\n";

					return 0;
			}
		}

		for (i = optind; i < argc; ++i) {
			contents = stylejs::File::getContents(argv[i]);

			if (!contents.empty()) {
				StyleJS += contents;

				if (!compile) {
					compile = true;
				}
			}
		}

		if (compile) {
			// Compile CSS, reuse StyleJS variable
			if (!useExternalStyle) {
				StyleJS = stylejs::getEmbeddedJavaScript() + "\n\n" + StyleJS;
			}

			// Initiate "compiler"
			stylejs::Compiler StyleCompiler;

			StyleJS = StyleCompiler.compile(StyleJS + "\ntoCSS();");

			if (saveOutput) {
				CSSFile << StyleJS;

				if (printOutput) {
					cout << StyleJS << "\n";
				} else {
					cout << "CSS output (" << StyleJS.length() << " bytes) saved to: " << CSSFilename << "\n";
				}
			} else {
				cout << StyleJS << "\n";
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