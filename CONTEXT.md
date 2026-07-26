# Domain Context

## Protected article reading gate

A protected article uses a password-based reading gate to discourage casual access.
It is not an authentication or confidentiality mechanism: static publishing may send
the password and article body to the browser. The module should make this limitation
explicit and keep gate state, URL cleanup, validation, and presentation policy local.

## Article category

An article category records its editorial provenance or format, such as original,
reposted, or reading notes. Categories are distinct from topical tags and are
published as structured article metadata.
