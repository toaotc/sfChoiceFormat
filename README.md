####sfChoiceFormat

This is an javascript implementation of [symfony's sfChoiceFormat](https://github.com/symfony/symfony1/blob/1.4/lib/i18n/sfChoiceFormat.class.php) developed by [Wei Zhuo](mailto:weizhuo@gmail.com)


	var string = '[0] are no files |[1] is one file |(1,Inf] are {number} files';
	var choice = new sfChoiceFormat();
	document.write choice.format(string, 0); //shows "are no files"


