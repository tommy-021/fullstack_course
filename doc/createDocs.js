const generateHtmlFromYaml = require("swagger-yaml-to-html");

// Provide input YAML path and output HTML path
const inputFilePath = "./spec.yaml";
const outputFilePath = "./index.html";

// Convert YAML to HTML
generateHtmlFromYaml(inputFilePath, outputFilePath);
