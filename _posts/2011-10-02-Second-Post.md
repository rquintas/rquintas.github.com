---
layout: post
---
Just testing!

<script type="IN/FullMemberProfile" data-id="http://pt.linkedin.com/in/rquintas" data-firstName="Ricardo" data-lastName="Quintas">

<script type="text/javascript" charset="utf-8">
	function getID() {
	   IN.API.Profile("me")
	   .result(function(result) { 
	     alert(result.values[0].id);
	   })
	}
</script>

<script type="IN/Login" data-onAuth="getID"></script>

