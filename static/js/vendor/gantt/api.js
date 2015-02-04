(function(){

var templates = [ 
	"leftside_text",
	"rightside_text",
	"task_text",
	"progress_text",
	"task_class"
];

function defaults(obj, std){
	for (var key in std)
		if (!obj[key])
			obj[key] = std[key];
	return obj;
}

function mark_columns(base){
	var columns = base.config.columns;
	if (columns)
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].template)
				columns[i].$template = true;
	}
}


function add_export_methods(gantt){

	gantt.exportToPDF = function(config){
		config = defaults((config || {}), { 
			name:"gantt.pdf",
			data:this._serialize_all(),
			config:gantt.config
		});
		this._send_to_export(config, "pdf");
	}

	gantt.exportToPNG = function(config){
		config = defaults((config || {}), { 
			name:"gantt.png",
			data:this._serialize_all(),
			config:gantt.config
		});
		this._send_to_export(config, "png");
	}

	gantt.exportToICal = function(config){
		config = defaults((config || {}), { 
			name:"gantt.ical",
			data:this._serialize_plain().data
		});
		this._send_to_export(config, "ical");
	}

	gantt.exportToExcel = function(config){
		config = defaults((config || {}), { 
			name:"gantt.xlsx",
			title:"Tasks",
			data:this._serialize_table(true).data,
			columns:this._serialize_columns()
		});
		this._send_to_export(config, "excel");
	}

	gantt._ajax_to_export = function(data, type, callback){
		delete data.callback;

		dhtmlxAjax.post("https://export.dhtmlx.com/gantt", 
			"type="+type+"&store=1&data="+encodeURIComponent(JSON.stringify(data)),
			function(loader){
				var fail = loader.xmlDoc.status > 400;
				var info = null;

				if (!fail){
					try{
						info = JSON.parse(loader.xmlDoc.responseText)
					}catch(e){}
				}
				callback(info);
			}
		);
	};

	gantt._send_to_export = function(data, type){
		if (data.callback)
			return gantt._ajax_to_export(data, type, data.callback);

		if (data.config)
			mark_columns(data, type);
		var form = this._create_hidden_form();
		form.firstChild.action = "https://export.dhtmlx.com/gantt";
		form.firstChild.childNodes[0].value = JSON.stringify(data);
		form.firstChild.childNodes[1].value = type;
		form.firstChild.submit();
	};

	gantt._create_hidden_form = function(){
		if (!this._hidden_export_form){
			var t = this._hidden_export_form = document.createElement("div");
			t.style.display = "none";
			t.innerHTML = "<form method='POST' target='_blank'><input type='text' name='data'><input type='hidden' name='type' value=''></form>";
			document.body.appendChild(t);
		}
		return this._hidden_export_form;
	};

	//patch broken json serialization in gantt 2.1
	var original = gantt.json._copyObject;
	function copy_object_base(obj){
		var copy = {};
		for (var key in obj){
			if (key.charAt(0) == "$")
				continue;
			copy[key] = obj[key];
		}
		copy.start_date = gantt.templates.xml_format(copy.start_date);
		if (copy.end_date)
			copy.end_date = gantt.templates.xml_format(copy.end_date);

		return copy;
	}

	function copy_object_plain(obj){
		var text = gantt.templates.task_text(obj.start_date, obj.end_date, obj);

		var copy = copy_object_base(obj);
		copy.text = text;

		return copy;
	}

	function copy_object_table(obj){
		var copy = copy_object_columns(obj, copy_object_plain(obj));
		if (copy.start_date)
			copy.start_date = copy.start_date.valueOf();
		if (copy.end_date)
			copy.end_date = copy.end_date.valueOf();
		return copy;
	}

	function copy_object_columns(obj, copy){
		for(var i=0; i<gantt.config.columns.length; i++){
			var ct = gantt.config.columns[i].template;
			if (ct) copy["_"+i] = ct(obj);
		}
		return copy;
	}

	function copy_object_all(obj){
		var copy = copy_object_base(obj);

		//serialize all text templates
		for (var i = 0; i < templates.length; i++){
			var template = gantt.templates[templates[i]];
			if (template)
				copy["$"+i]	= template(obj.start_date, obj.end_date, obj);
		}

		copy_object_columns(obj, copy);
		copy.open = obj.$open;
		return copy;
	};


	gantt._serialize_all = function(){
		gantt.json._copyObject = copy_object_all;
		var data = export_serialize();
		gantt.json._copyObject = original;
		return data;
	};

	gantt._serialize_plain = function(){
		var config = gantt.templates.xml_format;
		gantt.templates.xml_format = gantt.date.date_to_str("%Y%m%dT%H%i%s", true);
		gantt.json._copyObject = copy_object_plain;

		var data = export_serialize();

		gantt.templates.xml_format = config;
		gantt.json._copyObject = original;

		delete data.links;
		return data;
	};

	gantt._serialize_table = function(){
		gantt.json._copyObject = copy_object_table;
		var data = export_serialize();
		gantt.json._copyObject = original;

		delete data.links;
		return data;
	};

	gantt._serialize_columns = function(){
		gantt.exportMode = true;

		var columns = [];
		var cols = gantt.config.columns;

		for (var i = 0; i < cols.length; i++){
			console.log(cols[i])
			if (cols[i].name == "add") continue;
			columns[i] = {
				id:		((cols[i].template) ? ("_"+i) : cols[i].name),
				header:	cols[i].label || gantt.locale.labels["column_"+cols[i].name],
				width: 	(cols[i].width ? Math.floor(cols[i].width/4) : "")
			}
			if (cols[i].name == "duration")
				columns[i].type = "number";
		}
		
		columns.push({
			id:"text", header:""
		});

		gantt.exportMode = false;
		return columns;
	};

	function export_serialize(){
		gantt.exportMode = true;
		var data = gantt.serialize();
		gantt.exportMode = false;
		return data;
	}
}

add_export_methods(gantt);
if (window.Gantt && Gantt.plugin)
	Gantt.plugin(add_export_methods);

})();