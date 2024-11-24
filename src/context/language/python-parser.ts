import { AbstractParser, EnclosingContext } from "../../constants";
import * as Parser from "tree-sitter";
import * as Python from "tree-sitter-python";

interface TreeNode {
  startPosition: { row: number };
  endPosition: { row: number };
  type: string;
}

export class PythonParser implements AbstractParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
    this.parser.setLanguage(Python);
  }

  findEnclosingContext(
    file: string,
    lineStart: number,
    lineEnd: number
  ): EnclosingContext {
    try {
      const tree = this.parser.parse(file);
      let largestEnclosingContext: TreeNode = null;
      let largestSize = 0;

      const cursor = tree.walk();
      let reachedStart = false;

      const visitNode = () => {
        const node = cursor.currentNode;

        // Python function or class definitions
        if (
          node.type === "function_definition" ||
          node.type === "class_definition"
        ) {
          const startLine = node.startPosition.row + 1; // tree-sitter uses 0-based lines
          const endLine = node.endPosition.row + 1;

          if (startLine <= lineStart && lineEnd <= endLine) {
            const size = endLine - startLine;
            if (size > largestSize) {
              largestSize = size;
              largestEnclosingContext = node;
            }
          }
        }

        if (cursor.gotoFirstChild()) {
          do {
            visitNode();
          } while (cursor.gotoNextSibling());
          cursor.gotoParent();
        }
      };

      visitNode();

      return {
        enclosingContext: largestEnclosingContext as any,
      };
    } catch (error) {
      console.error("Error parsing Python file:", error);
      return {
        enclosingContext: null,
      };
    }
  }

  dryRun(file: string): { valid: boolean; error: string } {
    try {
      const tree = this.parser.parse(file);
      // Check if there are syntax errors by looking at the root node
      const hasErrors = tree.rootNode.type === "ERROR";
      return {
        valid: !hasErrors,
        error: hasErrors ? "Parse error in Python file" : "",
      };
    } catch (error) {
      return {
        valid: false,
        error: error.toString(),
      };
    }
  }
}
