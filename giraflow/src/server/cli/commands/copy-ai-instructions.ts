import { Command } from 'commander';
import { copyFileSync } from 'fs';
import { join } from 'path';
import { getBundledAiInstructionsPath } from '../validation.js';

export function copyAiInstructionsCommand(): Command {
  return new Command('copy-ai-instructions')
    .description('Copy AI instructions (design-methodology.md) to the current directory')
    .action(() => {
      const source = getBundledAiInstructionsPath();
      if (!source) {
        console.error('Error: Bundled AI instructions not found');
        process.exit(1);
      }
      const dest = join(process.cwd(), 'giraflow-ai-instructions.md');
      copyFileSync(source, dest);
      console.log(`AI instructions copied to ${dest}`);
    });
}
