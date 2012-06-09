/**
 * @author Martin Gallagher <martin@martinpaulgallagher.com>
 */

#include "jss.hpp"

int main(int argc, char* argv[]) {
	if (argc > 1) {
		bool compile = false;
		bool printOutput = false;
		bool saveOutput = false;
		bool useExternalJSSFile = false;
		char c;
		unsigned char i;
		char* CSSFilename;
		ofstream CSSFile;
		string contents;
		string JSS;

		while ((c = getopt(argc, argv, "o:j:p")) != -1) {
			switch (c) {
				case 'o':
					if (optarg != NULL) {
						// Cache output filename
						CSSFilename = optarg;

						// Open file file writing and truncate contents
						CSSFile.open(CSSFilename, ios::out | ios::trunc);

						saveOutput = CSSFile.is_open();

						if (!saveOutput) {
							cout << "ERROR: The CSS output file isn't writable!\n";
						} else {
							break;
						}
					}

					return 0;

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


				case 'h':
					// Help information

					return 0;
			}
		}

		for (i = optind; i < argc; ++i) {
			contents = jss::File::getContents(argv[i]);

			if (!contents.empty()) {
				JSS += contents;

				if (!compile) {
					compile = true;
				}
			}
		}

		if (compile) {
			// Compile CSS, reuse JSS variable
			if (!useExternalJSSFile) {
				JSS = jss::getJS() + "\n\n" + JSS;
			}

			// Initiate "compiler"
			jss::Compiler JSSCompiler;

			JSS = JSSCompiler.compile(JSS + "\ntoCSS();");

			if (saveOutput) {
				CSSFile << JSS;

				if (printOutput) {
					cout << JSS << "\n";
				} else {
					cout << "Compiled CSS output (" << JSS.length() << " bytes) saved to: " << CSSFilename << "\n";
				}
			} else {
				cout << JSS << "\n";
			}
		} else {
			cout << "No valid files were found to transform!\n";
		}

		CSSFile.close();
	} else {
		cout << "Please provide at least one file to compile to CSS.\n";
	}

	return 0;
}