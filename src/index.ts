import { Command, Option } from "commander";

import * as PL from "./plutus-light/plutus-light" ;

import { apply_and_log_result, apply_and_write_result } from './command_helpers';

const program = new Command();

program
    .name("Hyperion")
    .description("A small CLI to help the ergonomics of Plutus-Light.")
    .version("1.0.0")

// hyperion compile <file_name>
// hyperion compile <file_name> --data
program.command("compile")
    .description("Compiles a Plutus-Light or Plutus-Light Data file to JSON.")
    .argument("file_path", "Path to the source file.")
    .option("-o, --output_file <path>", "Add custom output file.")
    .option("-p, --print_output", "Prints the result of the compilation")
    .option("-d, --data", "Parse Plutus-Light Data.")
    .option("-v, --verbose", "Turn on verbose mode.")
    .action((file_path, options) => {
        let func = PL.compilePlutusLightProgram;
        if (options.data) { func = PL.compilePlutusLightData }

        if (options.print_output) {
            apply_and_log_result(func)(file_path, options.verbose)
        } else {
		    apply_and_write_result(func)
			    (file_path, options.output_file, "json", options.verbose);
        }
    })

// hyperion pretty_print <file_name>
program.command("pretty_print")
    .description("Pretty print Plutus-Light source code.")
    .argument("file_path", "Path to the source file.")
    .option("-v, --verbose", "Turn on verbose mode.")
    .action((file_path, options) => {
		let verbose = options.verbose as boolean;
		apply_and_log_result(PL.prettySource)(file_path, verbose);
    })

// ! Low Priority
// TODO
// hyperion deserialize <file_name>
// hyperion deserialize <file_name> --bytes
// hyperion deserialize <file_name> --hex
program.command("deserialize")
    .description("Deserialze Plutus Core from bytes.")
    .argument("file_path", "Path to the source file.")
    .option("-o, --output_file <output_path>", "Add custom output file.")
    .option("-v, --verbose", "Turn on verbose mode.")
    .option("-b, --bytes", "Deserialize Plutus Core from CBOR bytes.")
    .option("-h, --hex", "Deserialize Plutus Core CBOR HexString.")
    .action((file_path, options) => {
        let func = PL.deserializePlutusCoreBytes;
        if (options.bytes) { func = PL.deserializePlutusCoreCborBytes }
        if (options.hex) { func = PL.deserializePlutusCoreCborHexString }

        if (!options.path) {
            apply_and_log_result(func)(file_path, options.verbose)
        } else {
            apply_and_write_result(func)
                (file_path, options.output_path, ".uplc", options.verbose)
        }
    })

// hyperion dump <file_name> --bytes
// hyperion dump <file_name> --hex
program.command("dump")
    .description("Dumps Plutus Core CBOR as bytes or a HexString.")
    .argument("file_path", "Path to the source file.")
    .option("-o, --output_file <output_path>", "Add custom output file.")
    .option("-v, --verbose", "Turn on verbose mode.")
    .option("-h, --hex", "Deserialize Plutus Core CBOR HexString.")
    .action((file_path, options) => {
        let func = PL.dumpPlutusCoreCborBytes;
        if (options.hex) { func = PL.deserializePlutusCoreCborHexString }
        
        if (!options.path) {
            apply_and_log_result(func)(file_path, options.verbose)
        } else {
            apply_and_write_result(func)
                (file_path, options.output_path, ".uplc", options.verbose)
        }
    })

// hyperion parse <file_name>
program.command("parse")
    .description("Parses Plutus Light.")
    .argument("file_path", "Path to the source file.")
    .option("-o, --output_file <output_path>", "Add custom output file.")
    .option("-v, --verbose", "Turn on verbose mode.")
    .action((file_path, options) => {
        let func = PL.parsePlutusLight;

        if (!options.path) {
            apply_and_log_result(func)(file_path, options.verbose)
        } else {
            apply_and_write_result(func)
                (file_path, options.output_path, ".uplc", options.verbose)
        }
    })

// hyperion tokenize <file_name> --bytes
// hyperion tokenize <file_name> --hex
program.command("tokenize")
    .description("Tokenizes Plutus Light.")
    .argument("file_path", "Path to the source file.")
    .option("-o, --output_file <output_path>", "Add custom output file.")
    .option("-v, --verbose", "Turn on verbose mode.")
    .option("-u, --upll", "Tokenize Untyped Plutus Light")
    .action((file_path, options) => {
        let func = PL.parsePlutusLight;
        if (options.upll) { func = PL.tokenizeUntypedPlutusLight }

        if (!options.path) {
            apply_and_log_result(func)(file_path, options.verbose)
        } else {
            apply_and_write_result(func)
                (file_path, options.output_path, ".uplc", options.verbose)
        }
    })

program.parse();