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