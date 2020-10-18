import { SchemaParser } from 'rnv';
import path from 'path';
import fs from 'fs';


const _printContent = (header, key, keyPath, prop, level) => {
    const examples = prop.examples || [];
    let exStr = '';
    if (prop.type === 'string' || prop.type === 'integer' || prop.type === 'boolean') {
        exStr = examples.map(v => `"${key}": "${v}"`).join('\n\n');
    } else if (prop.type === 'object' || prop.type === 'array') {
        exStr = examples.map(v => `"${key}": ${JSON.stringify(v, null, 2)}`).join('\n\n');
    }
    // else if (prop.type === 'array') {
    //     exStr = examples.map(v => `"${key}": ${JSON.stringify(v, null, 2)}`).join('\n\n');
    // }
    return `${header} ${level < 2 ? key : keyPath}

type: \`${prop.type}\`

${prop.description || 'TODO description'}

path:
\`renative.json/#/${keyPath}\`

examples:

\`\`\`json
${exStr}
\`\`\`

`;
};

const _parseSubProps = (c, obj, level, parentKey) => {
    let pk = parentKey;
    let out = '';
    let header = '##';

    for (let i = 0; i < level; i++) {
        header += '#';
    }
    let properties = obj?.properties;
    if (!properties) {
        properties = obj?.additionalProperties?.properties;
        if (properties) {
            pk = `${pk}.[object]`;
        }
    }


    if (properties) {
        Object.keys(properties).sort().forEach((k) => {
            const prop = properties[k];
            const key = `${pk}.${k}`;
            out += `${_printContent(header, k, key, prop, level)}

${_parseSubProps(c, properties[k], level + 1, key)}
`;
        });
    }
    return out;
};

export const generateApiConfigDocs = async (c) => {
    let output = `---
id: api-config
title: renative.json API Reference
sidebar_label: renative.json
---

Following Config reference applies to all \`renative.json\` files, including:

\`./renative.json\`

\`./appConfigs/base/renative.json\`

\`./appConfigs/\\<APP_ID\\>/renative.json\`

\`\\<WORKSPACE\\>/renative.json\`

\`\\<WORKSPACE\\>/\\<PROJECT_ID\\>/renative.json\`

\`\\<WORKSPACE\\>/\\<PROJECT_ID\\>/appConfigs/base/renative.json\`

\`\\<WORKSPACE\\>/\\<PROJECT_ID\\>/appConfigs/\\<APP_ID\\>/renative.json\`

---
`;

    const rootSchema = SchemaParser.getRootSchema();

    Object.keys(rootSchema.properties).sort().forEach((k1) => {
        const prop = rootSchema.properties[k1];
        output += `${_printContent('##', k1, k1, prop, 1)}

${_parseSubProps(c, prop, 1, k1)}

---

`;
    });


    fs.writeFileSync(path.join(c.paths.project.dir, '../../docs/api-config.md'), output);
};
