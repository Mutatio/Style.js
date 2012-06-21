/**
 * @author Martin Gallagher <martin@martinpaulgallagher.com>
 */

#include "jss.hpp"

using namespace jss;

/**
 * Attempt to transform JavaScript style string to CSS
 * @param javascript
 * @return
 */
string Compiler::compile(string javascript) {
	HandleScope handle_scope;

	Persistent<Context> context = Context::New();

	// Enter the created context for compiling
	Context::Scope context_scope(context);

	// Create a string containing the JavaScript source code.
	Handle<v8::String> javascriptString = v8::String::New(jss::String::toChar(javascript));

	// Compile the JavaScript string
	Handle<Script> script = Script::Compile(javascriptString);
	// Run the script to get the result
	Handle<Value> result = script->Run();

	// Clean up
	script.Clear();
	context.Dispose();

	// Convert the result to an ASCII string and print it.
	v8::String::AsciiValue ascii(result);

	return *ascii;
}

// Reusable global file stream, used in File::getContents
ifstream fileStream;

/**
 * Returns the contents of the given file
 * @param filename path to file
 * @return file contents
 */
string File::getContents(string filename) {
	string out;
	string line;

	fileStream.open(filename);

	if (fileStream.is_open()) {
		while (fileStream.good()) {
			getline(fileStream, line);

			out += line + "\n";
		}

		fileStream.close();

		return out;
	}
}

/**
 * Converts string to char sequence
 * @param str string to be converted
 * @return char sequence
 */
char* jss::String::toChar(string str) {
	unsigned int len = str.size();
	char* c = new char[len + 1];
	c[len] = 0;

	memcpy(c, str.c_str(), len);

	return c;
}