/**
 * @fileoverview Tests for no-ex-assign rule.
 * @author Stephen Murray <spmurrayzzz>
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-ex-assign"),
	RuleTester = require("../../../lib/rule-tester/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-ex-assign", rule, {
	valid: [
		"try { } catch (e) { three = 2 + 1; }",
		{
			code: "try { } catch ({e}) { this.something = 2; }",
			languageOptions: { ecmaVersion: 6 },
		},
		"function foo() { try { } catch (e) { return false; } }",
	],
	invalid: [
		{
			code: "try { } catch (e) { e = 10; }",
			errors: [{ messageId: "unexpected", type: "Identifier" }],
		},
		{
			code: "try { } catch (ex) { ex = 10; }",
			errors: [{ messageId: "unexpected", type: "Identifier" }],
		},
		{
			code: "try { } catch (ex) { [ex] = []; }",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unexpected", type: "Identifier" }],
		},
		{
			code: "try { } catch (ex) { ({x: ex = 0} = {}); }",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unexpected", type: "Identifier" }],
		},
		{
			code: "try { } catch ({message}) { message = 10; }",
			languageOptions: { ecmaVersion: 6 },
			errors: [{ messageId: "unexpected", type: "Identifier" }],
		},
	],
});
