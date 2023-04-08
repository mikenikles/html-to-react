export = ProcessingInstructions;
declare function ProcessingInstructions(): {
    defaultProcessingInstructions: {
        shouldProcessNode: typeof ShouldProcessNodeDefinitions.shouldProcessEveryNode;
        processNode: any;
    }[];
};
import ShouldProcessNodeDefinitions = require("./should-process-node-definitions");
//# sourceMappingURL=processing-instructions.d.ts.map