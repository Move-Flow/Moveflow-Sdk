import { initProgram } from './option';
import { walletCmd } from './walletCmd';

const program = initProgram();

walletCmd(program);

program.parse();