# SHUNT extension for Visual Studio Code

Line selection and multi-cursor tricks.

-----------------------------------------------------------------------------------------------------------

## Features

* **SHUNT LEFT**
  + Set multiple cursors on a straight column based on the leftmost non-space character of the selection


* **SHUNT RIGHT**
  + Set multiple cursors on a straight column based on the rightmost character of the selection


* **SHUNT SELECT**
  + Select the contents of each line separatedly, ignoring empty ones. Follow with `home` or `end` to set multiple cursors on either side of each line.


> **NOTES**
>
> + The last line is ignored unless fully selected
> + Lines will be padded with spaces or tabs as needed

-----------------------------------------------------------------------------------------------------------

## How to use

After selecting a simple block of lines:

**Feature** | **Shortcut Key**
:--- |:---:
**Shunt Left** | `ctrl+alt+o`
**Shunt Right** | `ctrl+alt+p`
**Shunt Select** | `ctrl+alt+k`
|

-----------------------------------------------------------------------------------------------------------

## Known issues

* In some cases, might not be accurate with mixed tabs and spaces. Identation with spaces is recommended.

-----------------------------------------------------------------------------------------------------------

## Source

[https://github.com/mycelo1/vsc-shunt](https://github.com/mycelo1/vsc-shunt)

-----------------------------------------------------------------------------------------------------------

## Support, issues and bug reports

[Create an issue](https://github.com/mycelo1/vsc-shunt/issues)

-----------------------------------------------------------------------------------------------------------

## Release Notes

### 1.0.0

Initial release.
