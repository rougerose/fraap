jQuery((function(e){let l=document.querySelector("#dialogMembers"),r={allowTouchMove:()=>!0};l&&new Fraap.FraapDialog(l,r);let a=document.querySelector(".directory-members_container-list");a&&a.querySelector(".collapsible")&&fraapCollapsible.init(a,!1),callback_map_members=function(e){new FraapMembers(e)}}));