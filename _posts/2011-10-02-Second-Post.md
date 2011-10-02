---
layout: post
---
Just testing!

<div id="profile"></div>

<script type="in/Login">
	IN.API.Profile("me")
    .result(function(result) { 
        $("#profile").html(JSON.stringify(result)) 
    } )
</script>