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

extern char _binary_Style_js_start[];
extern char _binary_Style_js_end[];

namespace stylejs {
	// Embedded Style.js version
	static const short STYLEJS_MAJOR_VERSION = 0;
	static const short STYLEJS_MINOR_VERSION = 0;
	static const short STYLEJS_PATCH_VERSION = 1;

	// stylec program version
	static const short STYLEC_MAJOR_VERSION = 1;
	static const short STYLEC_MINOR_VERSION = 0;
	static const short STYLEC_PATCH_VERSION = 0;

	/**
	 * @return Copy of embedded Style.js
	 */
	static string getJS() {
		char* c;

		stringstream ss(stringstream::in | stringstream::out);

		for (c = _binary_Style_js_start; c != _binary_Style_js_end; ++c) {
			ss << *c;
		}

		return ss.str();
	}

	/**
	 * @return Formatted string output of Style.js version
	 */
	static string getStyleJSVersion() {
		stringstream in;
		string out;

		in << STYLEJS_MAJOR_VERSION << "." << STYLEJS_MINOR_VERSION << "." << STYLEJS_PATCH_VERSION;
		in >> out;

		return out;
	}

	/**
	 * @return Formatted string output of stylec version
	 */
	static string getStyleCVersion() {
		stringstream in;
		string out;

		in << STYLEC_MAJOR_VERSION << "." << STYLEC_MINOR_VERSION << "." << STYLEC_PATCH_VERSION;
		in >> out;

		return out;
	}

	/**
	 * @return Formatted string output of Style.js, stylec and Google V8 versions
	 */
	static string getVersionString() {
		return "-------------------\nComponent | Version\n-------------------\nStyle.js  | " + getStyleJSVersion() + "\nstylec    | " + getStyleCVersion() + "\nGoogle V8 | " + V8::GetVersion();
	}

	class Compiler {
	public:
		static string compile(string);
	};

	class File {
	public:
		static string getContents(string);
	};

	class String {
	public:
		static char* toChar(string);
	};
}