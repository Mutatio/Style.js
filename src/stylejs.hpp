/**
 * @author Martin Gallagher <martin@martinpaulgallagher.com>
 */

#include <fstream>
#include <iostream>
#include <sstream>
#include <string.h>
#include <v8.h>

using namespace std;
using namespace v8;

// Type.js
extern char _binary_Type_js_start[];
extern char _binary_Type_js_end[];

// Util.js
extern char _binary_Util_js_start[];
extern char _binary_Util_js_end[];

// Style.js
extern char _binary_Style_js_start[];
extern char _binary_Style_js_end[];

namespace stylejs {
	// stylec program version
	static const unsigned short MAJOR_VERSION = 0;
	static const unsigned short MINOR_VERSION = 1;
	static const unsigned short PATCH_VERSION = 0;

	// Flags determining embedded JS use
	static bool useEmbeddedTypeJS = true;
	static bool useEmbeddedUtilJS = true;
	static bool useEmbeddedStyleJS = true;

	/**
	 * @return Copy of embedded Style.js
	 */
	static string getEmbeddedJavaScript(string TypeJS, string UtilJS, string StyleJS) {
		char* c;

		stringstream ss(stringstream::in | stringstream::out);

		if (useEmbeddedTypeJS) {
			for (c = _binary_Type_js_start; c != _binary_Type_js_end; ++c) {
				ss << *c;
			}
		} else {
			ss << TypeJS;
		}

		ss << "\n\n";

		if (useEmbeddedUtilJS) {
			for (c = _binary_Util_js_start; c != _binary_Util_js_end; ++c) {
				ss << *c;
			}
		} else {
			ss << UtilJS;
		}

		ss << "\n\n";

		if (useEmbeddedStyleJS) {
			for (c = _binary_Style_js_start; c != _binary_Style_js_end; ++c) {
				ss << *c;
			}
		} else {
			ss << StyleJS;
		}

		return ss.str();
	}

	/**
	 * Returns the embedded library contents
	 * @return Copy of embedded Style.js
	 */
	static string getEmbeddedJavaScript() {
		return getEmbeddedJavaScript("", "", "");
	}

	/**
	 * @return Formatted string output of stylec version
	 */
	static string getVersion() {
		stringstream in;
		string out;

		in << MAJOR_VERSION << "." << MINOR_VERSION << "." << PATCH_VERSION;
		in >> out;

		return out;
	}

	class Compiler {
	public:
		static string compile(string);
	};

	class File {
	public:
		static string getContents(char*);
	};

	class String {
	public:
		static char* toChar(string);
	};

	class About {
	public:
		static string getVersionString();
	};
}