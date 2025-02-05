import configureProperties from 'fontoxml-families/src/configureProperties';
import type { SxModule } from 'fontoxml-modular-schema-experience/src/sxManager';
import xq from 'fontoxml-selectors/src/xq';

/**
 * This module is included in all schema experiences for DITA map specializations in order to
 * configure the documentsHierarchy represented by those maps. For maximum DITA-compatibility, the
 * following configuration uses the `fonto:dita-class` function to apply to and match any DITA
 * specialization of these elements.
 *
 * For very large documents performance may be improved by replacing this configuration with
 * separate rules, one per element, with a selector that explicitly mentions that element:
 *
 * ```
 * configureProperties(sxModule, 'self::topicref', ...);
 * configureProperties(sxModule, 'self::mapref', ...);
 * configureProperties(sxModule, 'self::topicgroup', ...);
 * ```
 *
 * Please refer to our documentation on XPath performance for more information:
 * https://documentation.fontoxml.com/latest/performance-a2c8c8d819cd#id-3d20b151-e9f0-6bf7-c051-9afc59761693
 *
 * Note that specific schema-specific configuration may override this configuration to match the
 * intended interpretation of specific elements.
 */
export default function configureSxModule(sxModule: SxModule): void {
	// Configure map and its specializations

	// Remove all hierarchy as an experiment to get all content in the top sheetframe.
}
