/**
 * @file Verilog grammar for tree-sitter
 * @author zhangwwpeng
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "verilog",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
