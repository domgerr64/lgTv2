import { z } from 'zod';

const GradleProperties = z
    .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
    .describe('Overrides values in `gradle.properties` file of generated android based project');

const BuildGradle = z
    .object({
        allprojects: z.object({
            repositories: z.record(z.string(), z.boolean()).describe('Customize repositories section of build.gradle'),
        }),
        plugins: z.array(z.string()),
        buildscript: z.object({
            repositories: z.record(z.string(), z.boolean()),
            dependencies: z.record(z.string(), z.boolean()),
        }),
        dexOptions: z.record(z.string(), z.boolean()),
        injectAfterAll: z.array(z.string()),
    })
    .describe('Overrides values in `build.gradle` file of generated android based project');

const AppBuildGradle = z
    .object({
        apply: z.array(z.string()),
        defaultConfig: z.array(z.string()),
        buildTypes: z.optional(
            z.object({
                debug: z.optional(z.array(z.string())),
                release: z.optional(z.array(z.string())),
            })
        ),
        afterEvaluate: z.optional(z.array(z.string())),
        implementations: z.optional(z.array(z.string())),
        implementation: z.optional(z.string()),
    })
    .describe('Overrides values in `app/build.gradle` file of generated android based project');

const ManifestChildBase = z.object({
    tag: z.string(),
    'android:name': z.string(),
    'android:required': z.optional(z.boolean()),
    // 'android:name': '.MainApplication',
    // 'android:allowBackup': true,
    // 'android:largeHeap': true,
    // 'android:usesCleartextTraffic': true,
    // 'tools:targetApi': 28,
});

// type ManifestFeature = {
//     tag: string;
//     'android:name': string;
//     'android:required': boolean;
//     children?: Array<ManifestFeature>;
// };

export type _ManifestChildType = z.infer<typeof ManifestChildBase> & {
    children?: _ManifestChildType[];
};

const ManifestChildWithChildren: z.ZodType<_ManifestChildType> = ManifestChildBase.extend({
    children: z.lazy(() => ManifestChildWithChildren.array()),
});

const AndroidManifest = ManifestChildBase.extend({
    package: z.string().optional(),
    children: z.array(ManifestChildWithChildren),
}).describe(`Allows you to directly manipulate \`AndroidManifest.xml\` via json override mechanism
Injects / Overrides values in AndroidManifest.xml file of generated android based project
> IMPORTANT: always ensure that your object contains \`tag\` and \`android:name\` to target correct tag to merge into
 `);

// const Gradle = z.object({

// });

export const TemplateAndroidBaseFragment = {
    gradle_properties: z.optional(GradleProperties),
    build_gradle: z.optional(BuildGradle),
    app_build_gradle: z.optional(AppBuildGradle),
    AndroidManifest_xml: z.optional(AndroidManifest),
    strings_xml: z.optional(
        z.object({
            children: z.optional(
                z.array(
                    z.object({
                        tag: z.string(),
                        name: z.string(),
                        child_value: z.string(),
                    })
                )
            ),
        })
    ),
    MainActivity_java: z.optional(
        z.object({
            onCreate: z
                .string({})
                .optional()
                .default('super.onCreate(savedInstanceState)')
                .describe('Overrides super.onCreate method handler of MainActivity.java'),
            imports: z.array(z.string()).optional(),
            methods: z.array(z.string()).optional(),
            createMethods: z.array(z.string()).optional(),
            resultMethods: z.array(z.string()).optional(),
        })
    ),
    MainApplication_java: z.optional(
        z
            .object({
                imports: z.array(z.string()).optional(),
                methods: z.array(z.string()).optional(),
                createMethods: z.array(z.string()).optional(),
                packages: z.array(z.string()).optional(),
                packageParams: z.array(z.string()).optional(),

                // onCreate: z
                //     .string({})
                //     .optional()
                //     .default('super.onCreate(savedInstanceState)')
                //     .describe('Overrides super.onCreate method handler of MainActivity.java'),
            })
            .describe('Allows you to configure behaviour of MainActivity')
    ),
};
// .describe('Allows more advanced modifications to Android based project template');

export type _ManifestChildWithChildrenType = z.infer<typeof ManifestChildWithChildren>;

export type _AndroidManifestType = z.infer<typeof AndroidManifest>;
