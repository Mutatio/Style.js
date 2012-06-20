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

extern char _binary_JSS_js_start[];
extern char _binary_JSS_js_end[];

namespace jss {
	// Embedded JSS version
	static const short JSS_MAJOR_VERSION = 0;
	static const short JSS_MINOR_VERSION = 0;
	static const short JSS_PATCH_VERSION = 1;

	// jssc program version
	static const short JSSC_MAJOR_VERSION = 1;
	static const short JSSC_MINOR_VERSION = 0;
	static const short JSSC_PATCH_VERSION = 0;

	/**
	 * @return Copy of embedded JSS JavaScript
	 */
	static string getJS() {
		char* c;

		stringstream ss(stringstream::in | stringstream::out);

		for (c = _binary_JSS_js_start; c != _binary_JSS_js_end; ++c) {
			ss << *c;
		}

		return ss.str();
	}

	/**
	 * @return Formatted string output of JSS version
	 */
	static string getJSSVersion() {
		stringstream in;
		string out;

		in << JSS_MAJOR_VERSION << "." << JSS_MINOR_VERSION << "." << JSS_PATCH_VERSION;
		in >> out;

		return out;
	}

	/**
	 * @return Formatted string output of JSSC version
	 */
	static string getJSSCVersion() {
		stringstream in;
		string out;

		in << JSSC_MAJOR_VERSION << "." << JSSC_MINOR_VERSION << "." << JSSC_PATCH_VERSION;
		in >> out;

		return out;
	}

	/**
	 * @return Formatted string output of JSS, JSSC and Google V8 versions
	 */
	static string getVersionString() {
		return "-------------------\nComponent | Version\n-------------------\nJSS       | " + getJSSVersion() + "\nJSSC      | " + getJSSCVersion() + "\nGoogle V8 | " + v8::V8::GetVersion();
	}

	class Compiler {
	private:
		HandleScope handle_scope;
		Persistent<Context> context; // Create a new context.
		Handle<v8::String> javascriptString;
		Handle<Script> script;
		Handle<Value> result;

	public:
		~Compiler();
		string compile(string);
	};

	class File {
	public:
		static string getContents(char*);
	};

	class String {
	public:
		static char* toChar(string);
	};
}