/*
@license

dhtmlxGantt v.3.1.1 dhtmlx.com
This software can be used only as part of dhtmlx.com site.
You are not allowed to use it on any other site

(c) Dinamenta, UAB.
*/
Gantt.plugin(function(t){t._markers||(t._markers={}),t.config.show_markers=!0,t.attachEvent("onClear",function(){t._markers={}}),t.attachEvent("onGanttReady",function(){function e(e){if(!t.config.show_markers)return!1;if(!e.start_date)return!1;var r=document.createElement("div");r.setAttribute("marker_id",e.id);var a="gantt_marker";t.templates.marker_class&&(a+=" "+t.templates.marker_class(e)),e.css&&(a+=" "+e.css),e.title&&(r.title=e.title),r.className=a;var n=t.posFromDate(e.start_date);if(r.style.left=n+"px",r.style.height=Math.max(t._y_from_ind(t._order.length),0)+"px",e.end_date){var i=t.posFromDate(e.end_date);
r.style.width=Math.max(i-n,0)+"px"}return e.text&&(r.innerHTML="<div class='gantt_marker_content' >"+e.text+"</div>"),r}var r=document.createElement("div");r.className="gantt_marker_area",t.$task_data.appendChild(r),t.$marker_area=r,t._markerRenderer=t._task_renderer("markers",e,t.$marker_area,null)}),t.attachEvent("onDataRender",function(){t.renderMarkers()}),t.getMarker=function(t){return this._markers?this._markers[t]:null},t.addMarker=function(t){return t.id=t.id||dhtmlx.uid(),this._markers[t.id]=t,t.id
},t.deleteMarker=function(t){return this._markers&&this._markers[t]?(delete this._markers[t],!0):!1},t.updateMarker=function(t){this._markerRenderer&&this._markerRenderer.render_item(t)},t.renderMarkers=function(){if(!this._markers)return!1;if(!this._markerRenderer)return!1;var t=[];for(var e in this._markers)t.push(this._markers[e]);return this._markerRenderer.render_items(t),!0}});
//# sourceMappingURL=../sources/ext/dhtmlxgantt_marker.js.map