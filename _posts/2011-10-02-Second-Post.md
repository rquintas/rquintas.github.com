---
layout: post
---
Just testing!

<div id="profile"></div>

<script type="text/javascript" src="http://platform.linkedin.com/in.js">
   api_key: a34tcundsf9a
	onLoad: onLinkedInLoad
   authorize: true
</script>

<script type="text/javascript" charset="utf-8">	
		function onLinkedInLoad() {
		  IN.API.Profile("Zfzb87U1Tn")
		    .fields(["id", "firstName", "lastName", "pictureUrl","headline"])
		    .result(function(result) {
		      profile = result.values[0];
		      profHTML = "<p><a href=\"" + profile.publicProfileUrl + "\">";
		      profHTML += "<img class=img_border align=\"left\" src=\"" + profile.pictureUrl + "\"></a>";      
		      profHTML += "<a href=\"" + profile.publicProfileUrl + "\">";
		      profHTML += "<h2 class=myname>" + profile.firstName + " " + profile.lastName + "</a> </h2>";
		      profHTML += "<span class=myheadline>" + profile.headline + "</span>";
		      $("#profile").html(profHTML);
		    });
		}
</script>

<!--<script type="IN/FullMemberProfile" data-id="Zfzb87U1Tn" data-firstName="Ricardo" data-lastName="Quintas"></script>-->

