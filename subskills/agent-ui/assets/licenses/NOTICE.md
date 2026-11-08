# React Agent UI source notice

The primary component source and token stylesheet in `assets/react-source/` are retained under the upstream MIT license in `UPSTREAM-MIT-LICENSE.txt`.

The local `Button`, `EntityChip`, `ValuePill`, and `GlideMenu` support modules were added to make the captured component tree self-contained under the documented local import paths. They do not contact an external service and are not runtime fallbacks.

The bundled Approval Card passes the latest selected answers to its delayed demo submit.
