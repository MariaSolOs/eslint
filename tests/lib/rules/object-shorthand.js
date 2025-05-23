/**
 * @fileoverview Tests for concise-object rule
 * @author Jamund Ferguson <http://www.jamund.com>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/object-shorthand"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");
const { unIndent } = require("../../_utils");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const PROPERTY_ERROR = {
	messageId: "expectedPropertyShorthand",
	type: "Property",
};
const METHOD_ERROR = { messageId: "expectedMethodShorthand", type: "Property" };
const LONGFORM_PROPERTY_ERROR = {
	messageId: "expectedPropertyLongform",
	type: "Property",
};
const LONGFORM_METHOD_ERROR = {
	messageId: "expectedMethodLongform",
	type: "Property",
};
const LONGFORM_METHOD_STRING_LITERAL_ERROR = {
	messageId: "expectedLiteralMethodLongform",
	type: "Property",
};
const ALL_SHORTHAND_ERROR = {
	messageId: "expectedAllPropertiesShorthanded",
	type: "ObjectExpression",
};
const MIXED_SHORTHAND_ERROR = {
	messageId: "unexpectedMix",
	type: "ObjectExpression",
};

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2018 } });

ruleTester.run("object-shorthand", rule, {
	valid: [
		"var x = {y() {}}",
		"var x = {y}",
		"var x = {a: b}",
		"var x = {a: 'a'}",
		"var x = {'a': 'a'}",
		"var x = {'a': b}",
		"var x = {y(x) {}}",
		"var {x,y,z} = x",
		"var {x: {y}} = z",
		"var x = {*x() {}}",
		"var x = {x: y}",
		"var x = {x: y, y: z}",
		"var x = {x: y, y: z, z: 'z'}",
		"var x = {x() {}, y: z, l(){}}",
		"var x = {x: y, y: z, a: b}",
		"var x = {x: y, y: z, 'a': b}",
		"var x = {x: y, y() {}, z: a}",
		"var x = {[y]: y}",
		"doSomething({x: y})",
		"doSomething({'x': y})",
		"doSomething({x: 'x'})",
		"doSomething({'x': 'x'})",
		"doSomething({y() {}})",
		"doSomething({x: y, y() {}})",
		"doSomething({y() {}, z: a})",
		"!{ a: function a(){} };",

		// arrow functions are still alright by default
		"var x = {y: (x)=>x}",
		"doSomething({y: (x)=>x})",
		"var x = {y: (x)=>x, y: a}",
		"doSomething({x, y: (x)=>x})",
		"({ foo: x => { return; }})",
		"({ foo: (x) => { return; }})",
		"({ foo: () => { return; }})",

		// getters and setters are ok
		"var x = {get y() {}}",
		"var x = {set y(z) {}}",
		"var x = {get y() {}, set y(z) {}}",
		"doSomething({get y() {}})",
		"doSomething({set y(z) {}})",
		"doSomething({get y() {}, set y(z) {}})",

		// object literal computed properties
		{
			code: "var x = {[y]: y}",
			options: ["properties"],
		},
		{
			code: "var x = {['y']: 'y'}",
			options: ["properties"],
		},
		{
			code: "var x = {['y']: y}",
			options: ["properties"],
		},

		// object literal computed methods
		{
			code: "var x = {[y]() {}}",
			options: ["methods"],
		},
		{
			code: "var x = {[y]: function x() {}}",
			options: ["methods"],
		},
		{
			code: "var x = {[y]: y}",
			options: ["methods"],
		},

		// options
		{
			code: "var x = {y() {}}",
			options: ["methods"],
		},
		{
			code: "var x = {x, y() {}, a:b}",
			options: ["methods"],
		},
		{
			code: "var x = {y}",
			options: ["properties"],
		},
		{
			code: "var x = {y: {b}}",
			options: ["properties"],
		},
		{
			code: "var x = {a: n, c: d, f: g}",
			options: ["never"],
		},
		{
			code: "var x = {a: function(){}, b: {c: d}}",
			options: ["never"],
		},

		// ignoreConstructors
		{
			code: "var x = {ConstructorFunction: function(){}, a: b}",
			options: ["always", { ignoreConstructors: true }],
		},
		{
			code: "var x = {_ConstructorFunction: function(){}, a: b}",
			options: ["always", { ignoreConstructors: true }],
		},
		{
			code: "var x = {$ConstructorFunction: function(){}, a: b}",
			options: ["always", { ignoreConstructors: true }],
		},
		{
			code: "var x = {__ConstructorFunction: function(){}, a: b}",
			options: ["always", { ignoreConstructors: true }],
		},
		{
			code: "var x = {_0ConstructorFunction: function(){}, a: b}",
			options: ["always", { ignoreConstructors: true }],
		},
		{
			code: "var x = {notConstructorFunction(){}, b: c}",
			options: ["always", { ignoreConstructors: true }],
		},
		{
			code: "var x = {ConstructorFunction: function(){}, a: b}",
			options: ["methods", { ignoreConstructors: true }],
		},
		{
			code: "var x = {_ConstructorFunction: function(){}, a: b}",
			options: ["methods", { ignoreConstructors: true }],
		},
		{
			code: "var x = {$ConstructorFunction: function(){}, a: b}",
			options: ["methods", { ignoreConstructors: true }],
		},
		{
			code: "var x = {__ConstructorFunction: function(){}, a: b}",
			options: ["methods", { ignoreConstructors: true }],
		},
		{
			code: "var x = {_0ConstructorFunction: function(){}, a: b}",
			options: ["methods", { ignoreConstructors: true }],
		},
		{
			code: "var x = {notConstructorFunction(){}, b: c}",
			options: ["methods", { ignoreConstructors: true }],
		},
		{
			code: "var x = {ConstructorFunction: function(){}, a: b}",
			options: ["never"],
		},
		{
			code: "var x = {notConstructorFunction: function(){}, b: c}",
			options: ["never"],
		},

		// methodsIgnorePattern
		{
			code: "var x = { foo: function() {}  }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
		},
		{
			code: "var x = { foo: function() {}  }",
			options: ["methods", { methodsIgnorePattern: "^foo$" }],
		},
		{
			code: "var x = { foo: function*() {}  }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
		},
		{
			code: "var x = { foo: async function() {}  }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
		},
		{
			code: "var x = { foo: () => { return 5; }  }",
			options: [
				"always",
				{
					methodsIgnorePattern: "^foo$",
					avoidExplicitReturnArrows: true,
				},
			],
		},
		{
			code: "var x = { 'foo': function() {}  }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
		},
		{
			code: "var x = { ['foo']: function() {}  }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
		},
		{
			code: "var x = { 123: function() {}  }",
			options: ["always", { methodsIgnorePattern: "^123$" }],
		},
		{
			code: "var x = { afoob: function() {}  }",
			options: ["always", { methodsIgnorePattern: "foo" }],
		},
		{
			code: "var x = { afoob: function() {}  }",
			options: ["always", { methodsIgnorePattern: "^.foo.$" }],
		},
		{
			code: "var x = { '👍foo👍': function() {}  }", // this wouldn't pass without the "u" flag
			options: ["always", { methodsIgnorePattern: "^.foo.$" }],
		},

		// avoidQuotes
		{
			code: "var x = {'a': function(){}}",
			options: ["always", { avoidQuotes: true }],
		},
		{
			code: "var x = {['a']: function(){}}",
			options: ["methods", { avoidQuotes: true }],
		},
		{
			code: "var x = {'y': y}",
			options: ["properties", { avoidQuotes: true }],
		},

		// ignore object shorthand
		{
			code: "let {a, b} = o;",
			options: ["never"],
		},
		{
			code: "var x = {foo: foo, bar: bar, ...baz}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
		},

		// consistent
		{
			code: "var x = {a: a, b: b}",
			options: ["consistent"],
		},
		{
			code: "var x = {a: b, c: d, f: g}",
			options: ["consistent"],
		},
		{
			code: "var x = {a, b}",
			options: ["consistent"],
		},
		{
			code: "var x = {a, b, get test() { return 1; }}",
			options: ["consistent"],
		},
		{
			code: "var x = {...bar}",
			options: ["consistent-as-needed"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "var x = {foo, bar, ...baz}",
			options: ["consistent"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "var x = {bar: baz, ...qux}",
			options: ["consistent"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "var x = {...foo, bar: bar, baz: baz}",
			options: ["consistent"],
			languageOptions: { ecmaVersion: 2018 },
		},

		// consistent-as-needed
		{
			code: "var x = {a, b}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {a, b, get test(){return 1;}}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {0: 'foo'}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {'key': 'baz'}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {foo: 'foo'}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {[foo]: foo}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {foo: function foo() {}}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {[foo]: 'foo'}",
			options: ["consistent-as-needed"],
		},
		{
			code: "var x = {bar, ...baz}",
			options: ["consistent-as-needed"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "var x = {bar: baz, ...qux}",
			options: ["consistent-as-needed"],
			languageOptions: { ecmaVersion: 2018 },
		},
		{
			code: "var x = {...foo, bar, baz}",
			options: ["consistent-as-needed"],
			languageOptions: { ecmaVersion: 2018 },
		},

		// avoidExplicitReturnArrows
		{
			code: "({ x: () => foo })",
			options: ["always", { avoidExplicitReturnArrows: false }],
		},
		{
			code: "({ x: () => { return; } })",
			options: ["always", { avoidExplicitReturnArrows: false }],
		},
		{
			code: "({ x: () => foo })",
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: "({ x() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: "({ x() { return; }, y() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: "({ x() { return; }, y: () => foo })",
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: "({ x: () => foo, y() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: "({ x: () => { this; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: "function foo() { ({ x: () => { arguments; } }) }",
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: `
                class Foo extends Bar {
                  constructor() {
                      var foo = { x: () => { super(); } };
                  }
              }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: `
                class Foo extends Bar {
                    baz() {
                        var foo = { x: () => { super.baz(); } };
                    }
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: `
                function foo() {
                    var x = { x: () => { new.target; } };
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: `
                function foo() {
                    var x = {
                        x: () => {
                            var y = () => { this; };
                        }
                    };
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: `
                function foo() {
                    var x = {
                        x: () => {
                            var y = () => { this; };
                            function foo() { this; }
                        }
                    };
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: `
                function foo() {
                    var x = {
                        x: () => {
                            return { y: () => { this; } };
                        }
                    };
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
		},
		{
			code: "({ [foo.bar]: () => {} })",
			options: ["always", { ignoreConstructors: true }],
		},
	],
	invalid: [
		{
			code: "var x = {x: x}",
			output: "var x = {x}",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {'x': x}",
			output: "var x = {x}",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {y: y, x: x}",
			output: "var x = {y, x}",
			errors: [PROPERTY_ERROR, PROPERTY_ERROR],
		},
		{
			code: "var x = {y: z, x: x, a: b}",
			output: "var x = {y: z, x, a: b}",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {y: z,\n x: x,\n a: b\n // comment \n}",
			output: "var x = {y: z,\n x,\n a: b\n // comment \n}",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {y: z,\n a: b,\n // comment \nf: function() {}}",
			output: "var x = {y: z,\n a: b,\n // comment \nf() {}}",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {a: b,\n/* comment */\ny: y\n }",
			output: "var x = {a: b,\n/* comment */\ny\n }",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {\n  a: b,\n  /* comment */\n  y: y\n}",
			output: "var x = {\n  a: b,\n  /* comment */\n  y\n}",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {\n  f: function() {\n    /* comment */\n    a(b);\n    }\n  }",
			output: "var x = {\n  f() {\n    /* comment */\n    a(b);\n    }\n  }",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {\n  [f]: function() {\n    /* comment */\n    a(b);\n    }\n  }",
			output: "var x = {\n  [f]() {\n    /* comment */\n    a(b);\n    }\n  }",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {\n  f: function*() {\n    /* comment */\n    a(b);\n    }\n  }",
			output: "var x = {\n  *f() {\n    /* comment */\n    a(b);\n    }\n  }",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {\n  f: /* comment */ function() {\n  }\n  }",
			output: null,
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {\n f /* comment */: function() {\n  }\n  }",
			output: null,
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {a: /* comment */ a}",
			output: null,
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {a /* comment */: a}",
			output: null,
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {a: (a /* comment */)}",
			output: null,
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {'a': /* comment */ a}",
			output: null,
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {'a': (a /* comment */)}",
			output: null,
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {'a' /* comment */: a}",
			output: null,
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {y: function() {}}",
			output: "var x = {y() {}}",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {y: function*() {}}",
			output: "var x = {*y() {}}",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {x: y, y: z, a: a}",
			output: "var x = {x: y, y: z, a}",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {ConstructorFunction: function(){}, a: b}",
			output: "var x = {ConstructorFunction(){}, a: b}",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {x: y, y: z, a: function(){}, b() {}}",
			output: "var x = {x: y, y: z, a(){}, b() {}}",
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {x: x, y: function() {}}",
			output: "var x = {x, y() {}}",
			errors: [PROPERTY_ERROR, METHOD_ERROR],
		},
		{
			code: "doSomething({x: x})",
			output: "doSomething({x})",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "doSomething({'x': x})",
			output: "doSomething({x})",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "doSomething({a: 'a', 'x': x})",
			output: "doSomething({a: 'a', x})",
			errors: [PROPERTY_ERROR],
		},
		{
			code: "doSomething({y: function() {}})",
			output: "doSomething({y() {}})",
			errors: [METHOD_ERROR],
		},
		{
			code: "doSomething({[y]: function() {}})",
			output: "doSomething({[y]() {}})",
			errors: [METHOD_ERROR],
		},
		{
			code: "doSomething({['y']: function() {}})",
			output: "doSomething({['y']() {}})",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ foo: async function () {} })",
			output: "({ async foo () {} })",
			languageOptions: { ecmaVersion: 8 },
			errors: [METHOD_ERROR],
		},
		{
			code: "({ 'foo': async function() {} })",
			output: "({ async 'foo'() {} })",
			languageOptions: { ecmaVersion: 8 },
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [foo]: async function() {} })",
			output: "({ async [foo]() {} })",
			languageOptions: { ecmaVersion: 8 },
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [foo.bar]: function*() {} })",
			output: "({ *[foo.bar]() {} })",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [foo   ]: function() {} })",
			output: "({ [foo   ]() {} })",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [ foo ]: async function() {} })",
			output: "({ async [ foo ]() {} })",
			languageOptions: { ecmaVersion: 8 },
			errors: [METHOD_ERROR],
		},
		{
			code: "({ foo: function *() {} })",
			output: "({ *foo() {} })",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [  foo   ]: function() {} })",
			output: "({ [  foo   ]() {} })",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [  foo]: function() {} })",
			output: "({ [  foo]() {} })",
			errors: [METHOD_ERROR],
		},

		// options
		{
			code: "var x = {y: function() {}}",
			output: "var x = {y() {}}",
			options: ["methods"],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {x, y() {}, z: function() {}}",
			output: "var x = {x, y() {}, z() {}}",
			options: ["methods"],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {ConstructorFunction: function(){}, a: b}",
			output: "var x = {ConstructorFunction(){}, a: b}",
			options: ["methods"],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {[y]: function() {}}",
			output: "var x = {[y]() {}}",
			options: ["methods"],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [(foo)]: function() { return; } })",
			output: "({ [(foo)]() { return; } })",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [(foo)]: async function() { return; } })",
			output: "({ async [(foo)]() { return; } })",
			languageOptions: { ecmaVersion: 8 },
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [(((((((foo)))))))]: function() { return; } })",
			output: "({ [(((((((foo)))))))]() { return; } })",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [(foo)]() { return; } })",
			output: "({ [(foo)]: function() { return; } })",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "({ async [(foo)]() { return; } })",
			output: "({ [(foo)]: async function() { return; } })",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "({ *[((foo))]() { return; } })",
			output: "({ [((foo))]: function*() { return; } })",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "({ [(((((((foo)))))))]() { return; } })",
			output: "({ [(((((((foo)))))))]: function() { return; } })",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "({ 'foo bar'() { return; } })",
			output: "({ 'foo bar': function() { return; } })",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "({ *foo() { return; } })",
			output: "({ foo: function*() { return; } })",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "({ async foo() { return; } })",
			output: "({ foo: async function() { return; } })",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "({ *['foo bar']() { return; } })",
			output: "({ ['foo bar']: function*() { return; } })",
			options: ["never"],
			languageOptions: { ecmaVersion: 8 },
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "var x = {x: x}",
			output: "var x = {x}",
			options: ["properties"],
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {a, b, c(){}, x: x}",
			output: "var x = {a, b, c(){}, x}",
			options: ["properties"],
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {y() {}}",
			output: "var x = {y: function() {}}",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "var x = {*y() {}}",
			output: "var x = {y: function*() {}}",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "var x = {y}",
			output: "var x = {y: y}",
			options: ["never"],
			errors: [LONGFORM_PROPERTY_ERROR],
		},
		{
			code: "var x = {y, a: b, *x(){}}",
			output: "var x = {y: y, a: b, x: function*(){}}",
			options: ["never"],
			errors: [LONGFORM_PROPERTY_ERROR, LONGFORM_METHOD_ERROR],
		},
		{
			code: "var x = {y: {x}}",
			output: "var x = {y: {x: x}}",
			options: ["never"],
			errors: [LONGFORM_PROPERTY_ERROR],
		},
		{
			code: "var x = {ConstructorFunction(){}, a: b}",
			output: "var x = {ConstructorFunction: function(){}, a: b}",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "var x = {notConstructorFunction(){}, b: c}",
			output: "var x = {notConstructorFunction: function(){}, b: c}",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},
		{
			code: "var x = {foo: foo, bar: baz, ...qux}",
			output: "var x = {foo, bar: baz, ...qux}",
			options: ["always"],
			languageOptions: { ecmaVersion: 2018 },
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {foo, bar: baz, ...qux}",
			output: "var x = {foo: foo, bar: baz, ...qux}",
			options: ["never"],
			languageOptions: { ecmaVersion: 2018 },
			errors: [LONGFORM_PROPERTY_ERROR],
		},

		// ignoreConstructors
		{
			code: "var x = {y: function() {}}",
			output: "var x = {y() {}}",
			options: ["methods", { ignoreConstructors: true }],
			errors: [METHOD_ERROR],
		},
		{
			// https://github.com/eslint/eslint/issues/11595
			code: "var x = {_y: function() {}}",
			output: "var x = {_y() {}}",
			options: ["methods", { ignoreConstructors: true }],
			errors: [METHOD_ERROR],
		},
		{
			// https://github.com/eslint/eslint/issues/11595
			code: "var x = {$y: function() {}}",
			output: "var x = {$y() {}}",
			options: ["methods", { ignoreConstructors: true }],
			errors: [METHOD_ERROR],
		},
		{
			// https://github.com/eslint/eslint/issues/11595
			code: "var x = {__y: function() {}}",
			output: "var x = {__y() {}}",
			options: ["methods", { ignoreConstructors: true }],
			errors: [METHOD_ERROR],
		},
		{
			// https://github.com/eslint/eslint/issues/11595
			code: "var x = {_0y: function() {}}",
			output: "var x = {_0y() {}}",
			options: ["methods", { ignoreConstructors: true }],
			errors: [METHOD_ERROR],
		},

		// methodsIgnorePattern
		{
			code: "var x = { afoob: function() {} }",
			output: "var x = { afoob() {} }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = { afoob: function() {} }",
			output: "var x = { afoob() {} }",
			options: ["methods", { methodsIgnorePattern: "^foo$" }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = { 'afoob': function() {} }",
			output: "var x = { 'afoob'() {} }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = { 1234: function() {} }",
			output: "var x = { 1234() {} }",
			options: ["always", { methodsIgnorePattern: "^123$" }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = { bar: function() {} }",
			output: "var x = { bar() {} }",
			options: ["always", { methodsIgnorePattern: "foo" }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = { [foo]: function() {} }",
			output: "var x = { [foo]() {} }",
			options: ["always", { methodsIgnorePattern: "foo" }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = { foo: foo }", // does not apply to properties
			output: "var x = { foo }",
			options: ["always", { methodsIgnorePattern: "^foo$" }],
			errors: [PROPERTY_ERROR],
		},

		// avoidQuotes
		{
			code: "var x = {a: a}",
			output: "var x = {a}",
			options: ["always", { avoidQuotes: true }],
			errors: [PROPERTY_ERROR],
		},
		{
			code: "var x = {a: function(){}}",
			output: "var x = {a(){}}",
			options: ["methods", { avoidQuotes: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {[a]: function(){}}",
			output: "var x = {[a](){}}",
			options: ["methods", { avoidQuotes: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "var x = {'a'(){}}",
			output: "var x = {'a': function(){}}",
			options: ["always", { avoidQuotes: true }],
			errors: [LONGFORM_METHOD_STRING_LITERAL_ERROR],
		},
		{
			code: "var x = {['a'](){}}",
			output: "var x = {['a']: function(){}}",
			options: ["methods", { avoidQuotes: true }],
			errors: [LONGFORM_METHOD_STRING_LITERAL_ERROR],
		},

		// consistent
		{
			code: "var x = {a: a, b}",
			output: null,
			options: ["consistent"],
			errors: [MIXED_SHORTHAND_ERROR],
		},
		{
			code: "var x = {b, c: d, f: g}",
			output: null,
			options: ["consistent"],
			errors: [MIXED_SHORTHAND_ERROR],
		},
		{
			code: "var x = {foo, bar: baz, ...qux}",
			output: null,
			options: ["consistent"],
			languageOptions: { ecmaVersion: 2018 },
			errors: [MIXED_SHORTHAND_ERROR],
		},

		// consistent-as-needed
		{
			code: "var x = {a: a, b: b}",
			output: null,
			options: ["consistent-as-needed"],
			errors: [ALL_SHORTHAND_ERROR],
		},
		{
			code: "var x = {a, z: function z(){}}",
			output: null,
			options: ["consistent-as-needed"],
			errors: [MIXED_SHORTHAND_ERROR],
		},
		{
			code: "var x = {foo: function() {}}",
			output: null,
			options: ["consistent-as-needed"],
			errors: [ALL_SHORTHAND_ERROR],
		},
		{
			code: "var x = {a: a, b: b, ...baz}",
			output: null,
			options: ["consistent-as-needed"],
			languageOptions: { ecmaVersion: 2018 },
			errors: [ALL_SHORTHAND_ERROR],
		},
		{
			code: "var x = {foo, bar: bar, ...qux}",
			output: null,
			options: ["consistent-as-needed"],
			languageOptions: { ecmaVersion: 2018 },
			errors: [MIXED_SHORTHAND_ERROR],
		},

		// avoidExplicitReturnArrows
		{
			code: "({ x: (arg => { return; }) })",
			output: "({ x(arg) { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: () => { return; } })",
			output: "({ x() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x() { return; }, y: () => { return; } })",
			output: "({ x() { return; }, y() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: () => { return; }, y: () => foo })",
			output: "({ x() { return; }, y: () => foo })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: () => { return; }, y: () => { return; } })",
			output: "({ x() { return; }, y() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR, METHOD_ERROR],
		},
		{
			code: "({ x: foo => { return; } })",
			output: "({ x(foo) { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: (foo = 1) => { return; } })",
			output: "({ x(foo = 1) { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: ({ foo: bar = 1 } = {}) => { return; } })",
			output: "({ x({ foo: bar = 1 } = {}) { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: () => { function foo() { this; } } })",
			output: "({ x() { function foo() { this; } } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: () => { var foo = function() { arguments; } } })",
			output: "({ x() { var foo = function() { arguments; } } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ x: () => { function foo() { arguments; } } })",
			output: "({ x() { function foo() { arguments; } } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: `
                ({
                    x: () => {
                        class Foo extends Bar {
                            constructor() {
                                super();
                            }
                        }
                    }
                })
            `,
			output: `
                ({
                    x() {
                        class Foo extends Bar {
                            constructor() {
                                super();
                            }
                        }
                    }
                })
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: `
                ({
                    x: () => {
                        function foo() {
                            new.target;
                        }
                    }
                })
            `,
			output: `
                ({
                    x() {
                        function foo() {
                            new.target;
                        }
                    }
                })
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ 'foo bar': () => { return; } })",
			output: "({ 'foo bar'() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [foo]: () => { return; } })",
			output: "({ [foo]() { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: 1, foo: async (bar = 1) => { return; } })",
			output: "({ a: 1, async foo(bar = 1) { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			languageOptions: { ecmaVersion: 8 },
			errors: [METHOD_ERROR],
		},
		{
			code: "({ [ foo ]: async bar => { return; } })",
			output: "({ async [ foo ](bar) { return; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			languageOptions: { ecmaVersion: 8 },
			errors: [METHOD_ERROR],
		},
		{
			// https://github.com/eslint/eslint/issues/11305
			code: "({ key: (arg = () => {}) => {} })",
			output: "({ key(arg = () => {}) {} })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: `
                function foo() {
                    var x = {
                        x: () => {
                            this;
                            return { y: () => { foo; } };
                        }
                    };
                }
            `,
			output: `
                function foo() {
                    var x = {
                        x: () => {
                            this;
                            return { y() { foo; } };
                        }
                    };
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: `
                function foo() {
                    var x = {
                        x: () => {
                            ({ y: () => { foo; } });
                            this;
                        }
                    };
                }
            `,
			output: `
                function foo() {
                    var x = {
                        x: () => {
                            ({ y() { foo; } });
                            this;
                        }
                    };
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: (function(){ return foo; }) })",
			output: "({ a(){ return foo; } })",
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: (() => { return foo; }) })",
			output: "({ a() { return foo; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: ((arg) => { return foo; }) })",
			output: "({ a(arg) { return foo; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: ((arg, arg2) => { return foo; }) })",
			output: "({ a(arg, arg2) { return foo; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: (async () => { return foo; }) })",
			output: "({ async a() { return foo; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: (async (arg) => { return foo; }) })",
			output: "({ async a(arg) { return foo; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ a: (async (arg, arg2) => { return foo; }) })",
			output: "({ async a(arg, arg2) { return foo; } })",
			options: ["always", { avoidExplicitReturnArrows: true }],
			errors: [METHOD_ERROR],
		},

		// async generators
		{
			code: "({ a: async function*() {} })",
			output: "({ async *a() {} })",
			options: ["always"],
			errors: [METHOD_ERROR],
		},
		{
			code: "({ async* a() {} })",
			output: "({ a: async function*() {} })",
			options: ["never"],
			errors: [LONGFORM_METHOD_ERROR],
		},

		// https://github.com/eslint/eslint/issues/18429
		{
			code: unIndent`
                const test = {
                    key: <T>(): void => { },
                    key: async <T>(): Promise<void> => { },

                    key: <T>(arg: T): T => { return arg },
                    key: async <T>(arg: T): Promise<T> => { return arg },
                }
            `,
			output: unIndent`
                const test = {
                    key<T>(): void { },
                    async key<T>(): Promise<void> { },

                    key<T>(arg: T): T { return arg },
                    async key<T>(arg: T): Promise<T> { return arg },
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/object-with-generic-arrow-fn-props"),
			},
			errors: Array(4).fill(METHOD_ERROR),
		},

		// typescript: arrow function should preserve the return value
		{
			code: unIndent`
                const test = {
                    key: (): void => {x()},
                    key: ( (): void => {x()} ),
                    key: ( (): (void) => {x()} ),

                    key: (arg: t): void => {x()},
                    key: ( (arg: t): void => {x()} ),
                    key: ( (arg: t): (void) => {x()} ),

                    key: (arg: t, arg2: t): void => {x()},
                    key: ( (arg: t, arg2: t): void => {x()} ),
                    key: ( (arg: t, arg2: t): (void) => {x()} ),

                    key: async (): void => {x()},
                    key: ( async (): void => {x()} ),
                    key: ( async (): (void) => {x()} ),

                    key: async (arg: t): void => {x()},
                    key: ( async (arg: t): void => {x()} ),
                    key: ( async (arg: t): (void) => {x()} ),

                    key: async (arg: t, arg2: t): void => {x()},
                    key: ( async (arg: t, arg2: t): void => {x()} ),
                    key: ( async (arg: t, arg2: t): (void) => {x()} ),
                }
            `,
			output: unIndent`
                const test = {
                    key(): void {x()},
                    key(): void {x()},
                    key(): (void) {x()},

                    key(arg: t): void {x()},
                    key(arg: t): void {x()},
                    key(arg: t): (void) {x()},

                    key(arg: t, arg2: t): void {x()},
                    key(arg: t, arg2: t): void {x()},
                    key(arg: t, arg2: t): (void) {x()},

                    async key(): void {x()},
                    async key(): void {x()},
                    async key(): (void) {x()},

                    async key(arg: t): void {x()},
                    async key(arg: t): void {x()},
                    async key(arg: t): (void) {x()},

                    async key(arg: t, arg2: t): void {x()},
                    async key(arg: t, arg2: t): void {x()},
                    async key(arg: t, arg2: t): (void) {x()},
                }
            `,
			options: ["always", { avoidExplicitReturnArrows: true }],
			languageOptions: {
				parser: require("../../fixtures/parsers/typescript-parsers/object-with-arrow-fn-props"),
			},
			errors: Array(18).fill(METHOD_ERROR),
		},
	],
});
