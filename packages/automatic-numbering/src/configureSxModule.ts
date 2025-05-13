import configureAsStructureViewItem from 'fontoxml-families/src/configureAsStructureViewItem';
import addReducer from 'fontoxml-indices/src/addReducer';
import xq from 'fontoxml-selectors/src/xq';

export default function configureSxModule(sxModule) {
	sxModule.markAsAddon();

	addReducer(
		// namespace and name of the reducer function being defined
		'http://example.app/ns',
		'getDivisionNumber',
		// selector matching nodes that should be counted
		"self::*[name()=('chapter', 'topicref', 'divisions')][not(@format='ditamap')][not(ancestor::appendix)]",
		// namespace and name of the accumulator function we defined above
		'http://example.app/ns',
		'divisionNumberingCallback'
	);

	addReducer(
		// namespace and name of the reducer function being defined
		'http://example.app/ns',
		'getAppendixNumber',
		// selector matching nodes that should be counted
		"self::*[name()=('appendix', 'topicref', 'appendices')][not(@format='ditamap')][not(ancestor::chapter)]",
		// namespace and name of the accumulator function we defined above
		'http://example.app/ns',
		'divisionNumberingCallback'
	);



	configureAsStructureViewItem(sxModule, xq`self::*[fonto:dita-class(., 'topic/topic')]`, {
		titleQuery: xq`
		import module namespace app = "http://example.app/ns";
		import module namespace fonto = "http://www.fontoxml.com/functions";

		let $numAppendix := app:getAppendixNumber(fonto:current-hierarchy-node-id(), .)
		let $numbering := 
			if (exists(app:getDivisionNumber(fonto:current-hierarchy-node-id(), .))) then
				app:getDivisionNumber(fonto:current-hierarchy-node-id(), .)
			else if (exists($numAppendix)) then
				(: Convert first level to alpha-upper. :)
				$numAppendix ! (if (position() = 1) then fn:format-integer(xs:integer(.), 'A') else .)
			else ()

		return if (not(empty($numbering))) then ( 
			string-join($numbering,	'.') || ' - ' || fonto:curated-text-in-node(.) 
		) else (
			(: If numbering function not applicable to the element :)
			fonto:curated-text-in-node(.) 
		)
		`,
		icon: 'file-text-o',
		isDraggable: true,
		priority: 1000
	});
}