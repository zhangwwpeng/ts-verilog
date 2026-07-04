export default grammar({
  name: "verilog",
  word: $ => $._word,
  extras: $ => [/\s/],
  precedences: $ => [
    ['_description', 'port_direction', 'dimension', 'data_type_or_implicit'],
    [$._description, $.tf_port_item],
  ],
  // conflicts: $ => [[$._description, $.tf_port_item]],
  rules: {
    // main
    source_file: $ => repeat($._description),
    _description: $ => prec('_description', seq(
      $.tf_port_item,
      repeat(seq(',', $.tf_port_item)),
      ';',
    )),

    // ** A.9.1 Attributes
    attribute_instance: $ => seq('(*', $._attr_identifier, '*)'),
    tf_port_item: $ => prec.right(choice(
      seq(
        repeat($.attribute_instance),
        optional($.port_direction),
        $.data_type_or_implicit,
        optional(field('variable', $.port_identifier)),
        repeat($.dimension),
      ),
      seq(
        repeat($.attribute_instance),
        optional($.port_direction),
        field('variable', $.port_identifier),
        repeat($.dimension),
      ),
    )),

    // base sample
    _word: $ => /[a-zA-Z_][a-zA-Z0-9_$]*/,
    simple_identifier: $ => $._word,
    _attr_identifier: $ => /[^*]+/,
    _dimension_identifier: $ => /[^]]+/,
    escaped_identifier: $ => seq('\\', /[^\s]*/), // \ { any_printable_ASCII_character_except_white_space } white_space
    _identifier: $ => choice(
      $.simple_identifier,
      $.escaped_identifier
    ),
    port_identifier: $ => $._identifier,

    // base define
    port_direction: $ => prec('port_direction', choice(
      'input', 'output', 'inout', 'ref', 'const ref'
    )),
    dimension: $ => prec('dimension',
      seq('[', $._dimension_identifier, ']'),
    ),
    _signing: $ => choice('signed', 'unsigned'),
    // integer type integer_atom_type non_integer_type
    simple_type: $ => choice('wire','bit', 'logic', 'reg','byte', 'shortint', 'int', 'longint', 'integer', 'time','shortreal', 'real', 'realtime','string','chandle','event',),
    struct_union: $ => choice(
      'struct',
      seq('union', optional(choice('soft', 'tagged')))
    ),
    data_type_or_implicit: $ => prec('data_type_or_implicit', prec.right(seq(
      optional('var'),
      choice(
        seq($._signing, repeat($.dimension)),
        seq($.simple_type, optional($._signing), repeat($.dimension)),
      )
    ))),

  }
});
