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
> + As these are multi-line commands, there's no point in selecting only one line or partial lines
> + The last line of the selection is ignored unless fully selected
> + Lines will be padded with spaces or tabs as needed (according to the current identation setting)

-----------------------------------------------------------------------------------------------------------

![shunt demo](https://cdn.rawgit.com/mycelo1/vsc-shunt/master/images/capture1.gif)

-----------------------------------------------------------------------------------------------------------

## How to use

* After selecting a simple block of lines:

**Feature** | **Shortcut Key**
:--- |:---:
**Shunt Left** | `ctrl+alt+o`
**Shunt Right** | `ctrl+alt+p`
**Shunt Select** | `ctrl+alt+k`
 |

* Or select lines by dragging the mouse over the line numbers, then right-click the selected block to access these commands the context menu.

-----------------------------------------------------------------------------------------------------------

## Known issues

* In some cases, might not be accurate with mixed tabs and spaces. Identation with spaces is recommended.

-----------------------------------------------------------------------------------------------------------

## Source

[https://github.com/mycelo1/vsc-shunt](https://github.com/mycelo1/vsc-shunt)

-----------------------------------------------------------------------------------------------------------

## Support, suggestions and bug reports

[Create an issue](https://github.com/mycelo1/vsc-shunt/issues)

-----------------------------------------------------------------------------------------------------------

## Release Notes

### 1.0.0

Initial release.

### 1.0.1

* Added context menu commands
* Added screen capture and more instructions to README
