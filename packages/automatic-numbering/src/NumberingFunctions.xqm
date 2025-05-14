module namespace app = "http://example.app/ns";

declare %public function app:divisionNumberingCallback(
    $previousAccumulator as item()*,
    $relType as xs:string,
    $node as node(),
    $isUnloaded as xs:boolean
) as item()* {
    if ($isUnloaded) then
		(: Does not necessarily match the selector when isUnloaded, SUP-5043. :)
		$previousAccumulator
    else if ($relType eq "first" or empty($previousAccumulator)) then
	    (: Return 1 for the first element, $previousAccumulator does not contain a value yet :)
	    1
	else if ($relType eq "parent") then
	    (: Add a new layer of "indentation" to the accumulator sequence :)
	    ($previousAccumulator, 1)
	else
	    (: Increment the last item in the accumulator sequence :)
	    $previousAccumulator ! (if (position() = last()) then . + 1 else .)
};
