---
layout: post
---
Just testing!

<script type="text/javascript" charset="utf-8">
	function getID() {
	   IN.API.Profile("me")
	   .result(function(result) { 
	     alert(result.values[0].id);
	   })
	}
</script>

<script type="IN/Login" data-onAuth="getID"></script>

