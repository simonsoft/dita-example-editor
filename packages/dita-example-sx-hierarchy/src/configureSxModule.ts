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

	configureProperties(sxModule, xq`self::*[fonto:dita-class(., "map/map")]`, {
		// maps have topicrefs and any of its specializations as children
		hierarchyChildNodesQuery: xq`child::*[fonto:dita-class(., "map/topicref")]`,
	});

	// Configure topicref and its specializations

	// Each topicref has topicrefs and any of its specializations as children
	configureProperties(
		sxModule,
		xq`self::*[fonto:dita-class(., "map/topicref")]`,
		{
			hierarchyChildNodesQuery: xq`child::*[fonto:dita-class(., "map/topicref")]`,
		}
	);
	// Each topicref with an href points at a content document. We'll use the document element for
	// consistency and to provide a useful `contextNodeId` on operations triggered from the
	// hierarchy node's Outline item.
	configureProperties(
		sxModule,
		xq`self::*[fonto:dita-class(., "map/topicref") and @href]`,
		{
			hierarchyContentQuery: xq`fonto:document(@href)/*`,
		}
	);
	// Each topicref without an href represents itself (e.g., topichead / topicgroup)
	configureProperties(
		sxModule,
		xq`self::*[fonto:dita-class(., "map/topicref") and not(@href)]`,
		{
			hierarchyContentQuery: xq`.`,
		}
	);

  // Each topicref with format="ditamap" points at a map and the hierarchy should include that
  // map's children
  // Maprefs don't need the format attribute and always refer to DITA maps
  configureProperties(
    sxModule,
    xq`self::*[(fonto:dita-class(., "map/topicref") and @format="ditamap") or self::mapref][@href]`,
    {
      // #1814 Any children of the mapref should not be displayed, consider cleaning up in backend (during save).
      hierarchyChildNodesQuery: xq`fonto:document(@href)/*/fonto:hierarchy-child-nodes(.)`,
    }
  );

  // #1814 Maprefs can refer to a subset of a DITA map
  // Unable to make fragment match the id (also tested without fonto:hierarchy-child-nodes(.))
  // Difficult to test with dev server due to broken handling of fragment when requesting the ditamap (Fonto makes GET req with fragment and dev server also fails to remove fragment).

  configureProperties(
    sxModule,
    xq`self::*[(fonto:dita-class(., "map/topicref") and @format="ditamap") or self::mapref][@href][contains(@href, '#')]`,
    {
      // Mapref with fragment functional in hierarchy, failure in other package.
      hierarchyChildNodesQuery: xq` let $href := @href return fonto:document(substring-before(@href, '#'))//*[@id = substring-after($href, '#')]`,
      priority: 10
    }
  );
}
