var WhammyCrs;

/*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atk’s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 characters…
			if (bitCounter++ % 4) {
				// …convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var d;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '0.1.0'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));



(function(){
		
		var Whammy = (function(){
	// in this case, frames has a very specific meaning, which will be 
	// detailed once i finish writing the code

	function toWebM(frames){
		var info = checkFrames(frames);
		var counter = 0;
		var EBML = [
			{
				"id": 0x1a45dfa3, // EBML
				"data": [
					{ 
						"data": 1,
						"id": 0x4286 // EBMLVersion
					},
					{ 
						"data": 1,
						"id": 0x42f7 // EBMLReadVersion
					},
					{ 
						"data": 4,
						"id": 0x42f2 // EBMLMaxIDLength
					},
					{ 
						"data": 8,
						"id": 0x42f3 // EBMLMaxSizeLength
					},
					{ 
						"data": "webm",
						"id": 0x4282 // DocType
					},
					{ 
						"data": 2,
						"id": 0x4287 // DocTypeVersion
					},
					{ 
						"data": 2,
						"id": 0x4285 // DocTypeReadVersion
					}
				]
			},
			{
				"id": 0x18538067, // Segment
				"data": [
					{ 
						"id": 0x1549a966, // Info
						"data": [
							{  
								"data": 1e6, //do things in millisecs (num of nanosecs for duration scale)
								"id": 0x2ad7b1 // TimecodeScale
							},
							{ 
								"data": "whammy",
								"id": 0x4d80 // MuxingApp
							},
							{ 
								"data": "whammy",
								"id": 0x5741 // WritingApp
							},
							{ 
								"data": doubleToString(info.duration),
								"id": 0x4489 // Duration
							}
						]
					},
					{
						"id": 0x1654ae6b, // Tracks
						"data": [
							{
								"id": 0xae, // TrackEntry
								"data": [
									{  
										"data": 1,
										"id": 0xd7 // TrackNumber
									},
									{ 
										"data": 1,
										"id": 0x63c5 // TrackUID
									},
									{ 
										"data": 0,
										"id": 0x9c // FlagLacing
									},
									{ 
										"data": "und",
										"id": 0x22b59c // Language
									},
									{ 
										"data": "V_VP8",
										"id": 0x86 // CodecID
									},
									{ 
										"data": "VP8",
										"id": 0x258688 // CodecName
									},
									{ 
										"data": 1,
										"id": 0x83 // TrackType
									},
									{
										"id": 0xe0,  // Video
										"data": [
											{
												"data": info.width,
												"id": 0xb0 // PixelWidth
											},
											{ 
												"data": info.height,
												"id": 0xba // PixelHeight
											}
										]
									}
								]
							}
						]
					},
					{
						"id": 0x1f43b675, // Cluster
						"data": [
							{  
								"data": 0,
								"id": 0xe7 // Timecode
							}
						].concat(frames.map(function(webp){
							var block = makeSimpleBlock({
								discardable: 0,
								frame: webp.data.slice(4),
								invisible: 0,
								keyframe: 1,
								lacing: 0,
								trackNum: 1,
								timecode: Math.round(counter)
							});
							counter += webp.duration;
							return {
								data: block,
								id: 0xa3
							};
						}))
					}
				]
			}
		];
		return generateEBML(EBML)
	}

	// sums the lengths of all the frames and gets the duration, woo

	function checkFrames(frames){
		var width = frames[0].width, 
			height = frames[0].height, 
			duration = frames[0].duration;
		for(var i = 1; i < frames.length; i++){
			if(frames[i].width != width) throw "Frame " + (i + 1) + " has a different width";
			if(frames[i].height != height) throw "Frame " + (i + 1) + " has a different height";
			if(frames[i].duration < 0) throw "Frame " + (i + 1) + " has a weird duration";
			duration += frames[i].duration;
		}
		return {
			duration: duration,
			width: width,
			height: height
		};
	}


	function numToBuffer(num){
		var parts = [];
		while(num > 0){
			parts.push(num & 0xff)
			num = num >> 8
		}
		return new Uint8Array(parts.reverse());
	}

	function strToBuffer(str){
		// return new Blob([str]);

		var arr = new Uint8Array(str.length);
		for(var i = 0; i < str.length; i++){
			arr[i] = str.charCodeAt(i)
		}
		return arr;
		// this is slower
		// return new Uint8Array(str.split('').map(function(e){
		// 	return e.charCodeAt(0)
		// }))
	}



	//sorry this is ugly, and sort of hard to understand exactly why this was done
	// at all really, but the reason is that there's some code below that i dont really
	// feel like understanding, and this is easier than using my brain.

	function bitsToBuffer(bits){
		var data = [];
		var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
		bits = pad + bits;
		for(var i = 0; i < bits.length; i+= 8){
			data.push(parseInt(bits.substr(i,8),2))
		}
		return new Uint8Array(data);
	}

	function generateEBML(json){
		var ebml = [];
		for(var i = 0; i < json.length; i++){
			var data = json[i].data;
			// console.log(data);
			if(typeof data == 'object') data = generateEBML(data);
			if(typeof data == 'number') data = bitsToBuffer(data.toString(2));
			if(typeof data == 'string') data = strToBuffer(data);
			// console.log(data)

			var len = data.size || data.byteLength;
			var zeroes = Math.ceil(Math.ceil(Math.log(len)/Math.log(2))/8);
			var size_str = len.toString(2);
			var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
			var size = (new Array(zeroes)).join('0') + '1' + padded;
			
			//i actually dont quite understand what went on up there, so I'm not really
			//going to fix this, i'm probably just going to write some hacky thing which
			//converts that string into a buffer-esque thing

			ebml.push(numToBuffer(json[i].id));
			ebml.push(bitsToBuffer(size));
			ebml.push(data)
			

		}
		return new Blob(ebml, {
			type: "video/webm"
		});
	}

	//OKAY, so the following two functions are the string-based old stuff, the reason they're
	//still sort of in here, is that they're actually faster than the new blob stuff because
	//getAsFile isn't widely implemented, or at least, it doesn't work in chrome, which is the
	// only browser which supports get as webp

	//Converting between a string of 0010101001's and binary back and forth is probably inefficient
	//TODO: get rid of this function
	function toBinStr_old(bits){
		var data = '';
		var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
		bits = pad + bits;
		for(var i = 0; i < bits.length; i+= 8){
			data += String.fromCharCode(parseInt(bits.substr(i,8),2))
		}
		return data;
	}

	function generateEBML_old(json){
		var ebml = '';
		for(var i = 0; i < json.length; i++){
			var data = json[i].data;
			if(typeof data == 'object') data = generateEBML_old(data);
			if(typeof data == 'number') data = toBinStr_old(data.toString(2));
			
			var len = data.length;
			var zeroes = Math.ceil(Math.ceil(Math.log(len)/Math.log(2))/8);
			var size_str = len.toString(2);
			var padded = (new Array((zeroes * 7 + 7 + 1) - size_str.length)).join('0') + size_str;
			var size = (new Array(zeroes)).join('0') + '1' + padded;

			ebml += toBinStr_old(json[i].id.toString(2)) + toBinStr_old(size) + data;

		}
		return ebml;
	}

	//woot, a function that's actually written for this project!
	//this parses some json markup and makes it into that binary magic
	//which can then get shoved into the matroska comtainer (peaceably)

	function makeSimpleBlock(data){
		var flags = 0;
		if (data.keyframe) flags |= 128;
		if (data.invisible) flags |= 8;
		if (data.lacing) flags |= (data.lacing << 1);
		if (data.discardable) flags |= 1;
		if (data.trackNum > 127) {
			throw "TrackNumber > 127 not supported";
		}
		var out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function(e){
			return String.fromCharCode(e)
		}).join('') + data.frame;

		return out;
	}

	// here's something else taken verbatim from weppy, awesome rite?

	function parseWebP(riff){
		var VP8 = riff.RIFF[0].WEBP[0];
		
		var frame_start = VP8.indexOf('\x9d\x01\x2a'); //A VP8 keyframe starts with the 0x9d012a header
		for(var i = 0, c = []; i < 4; i++) c[i] = VP8.charCodeAt(frame_start + 3 + i);
		
		var width, horizontal_scale, height, vertical_scale, tmp;
		
		//the code below is literally copied verbatim from the bitstream spec
		tmp = (c[1] << 8) | c[0];
		width = tmp & 0x3FFF;
		horizontal_scale = tmp >> 14;
		tmp = (c[3] << 8) | c[2];
		height = tmp & 0x3FFF;
		vertical_scale = tmp >> 14;
		return {
			width: width,
			height: height,
			data: VP8,
			riff: riff
		}
	}

	// i think i'm going off on a riff by pretending this is some known
	// idiom which i'm making a casual and brilliant pun about, but since
	// i can't find anything on google which conforms to this idiomatic
	// usage, I'm assuming this is just a consequence of some psychotic
	// break which makes me make up puns. well, enough riff-raff (aha a
	// rescue of sorts), this function was ripped wholesale from weppy

	function parseRIFF(string){
		var offset = 0;
		var chunks = {};
		
		while (offset < string.length) {
			var id = string.substr(offset, 4);
			var len = parseInt(string.substr(offset + 4, 4).split('').map(function(i){
				var unpadded = i.charCodeAt(0).toString(2);
				return (new Array(8 - unpadded.length + 1)).join('0') + unpadded
			}).join(''),2);
			var data = string.substr(offset + 4 + 4, len);
			offset += 4 + 4 + len;
			chunks[id] = chunks[id] || [];
			
			if (id == 'RIFF' || id == 'LIST') {
				chunks[id].push(parseRIFF(data));
			} else {
				chunks[id].push(data);
			}
		}
		return chunks;
	}

	// here's a little utility function that acts as a utility for other functions
	// basically, the only purpose is for encoding "Duration", which is encoded as
	// a double (considerably more difficult to encode than an integer)
	function doubleToString(num){
		return [].slice.call(
			new Uint8Array(
				(
					new Float64Array([num]) //create a float64 array
				).buffer) //extract the array buffer
			, 0) // convert the Uint8Array into a regular array
			.map(function(e){ //since it's a regular array, we can now use map
				return String.fromCharCode(e) // encode all the bytes individually
			})
			.reverse() //correct the byte endianness (assume it's little endian for now)
			.join('') // join the bytes in holy matrimony as a string
	}

	function WhammyVideo(speed, quality){ // a more abstract-ish API
		this.frames = [];
		this.duration = 1000 / speed;
		this.quality = quality || 0.8;
	}

	WhammyVideo.prototype.add = function(frame, duration){
		if(typeof duration != 'undefined' && this.duration) throw "you can't pass a duration if the fps is set";
		if('canvas' in frame){ //CanvasRenderingContext2D
			frame = frame.canvas;	
		}
		if('toDataURL' in frame){
			frame = frame.toDataURL('image/webp', this.quality)
		}else if(typeof frame != "string"){
			throw "frame must be a a HTMLCanvasElement, a CanvasRenderingContext2D or a DataURI formatted string"
		}
		if (!(/^data:image\/webp;base64,/ig).test(frame)) {
			throw "Input must be formatted properly as a base64 encoded DataURI of type image/webp";
		}
		this.frames.push({
			image: frame,
			duration: duration || this.duration
		})
	}
	
	WhammyVideo.prototype.compile = function(){
		return new toWebM(this.frames.map(function(frame){
			var webp = parseWebP(parseRIFF(base64.decode(frame.image.slice(23))));
			webp.duration = frame.duration;
			return webp;
		}))
	}

	return {
		Video: WhammyVideo,
		fromImageArray: function(images, fps){
			return toWebM(images.map(function(image){
				var webp = parseWebP(parseRIFF(base64.decode(image.slice(23))))
				webp.duration = 1000 / fps;
				return webp;
			}))
		},
		toWebM: toWebM
		// expose methods of madness
	}
})()






//--------------------------------------------------------------------------------
//#################################################################################


		
		WhammyCrs = function(){
			var self = this;
			this.frames = [];
			this.counterval = 0;
			this.retrival = 0;
			this.framerate = 0;
			this.interaval = null;
			this.progress = null;
			this.onConvert = null;
			this.workers_lenght = 5;
			this.workers = [];
			this.rotation = 0;
			this.framenumber = 0;
			for(var x =0; x < self.workers_lenght; ++x){
				this.workers.push(new Worker('WhammyWorker.js'));
				this.workers[x].addEventListener('message', function(e) {
					++self.retrival;
					self.onConvert && self.onConvert(++self.counterval);
					self.frames[e.data.frame] = e.data.webp;
				}, false);
			}
		}

		WhammyCrs.prototype.reset = function(){
			this.counterval = 0;
			this.rotation = 0;
			this.retrival = 0;
			this.frames = [];
			this.framerate = 0;
			this.framenumber = 0;
			this.interaval && clearInterval(this.interaval);
			this.interaval = null;
		}

		WhammyCrs.prototype.addFrame = function(imagedata,width,height){
			var self = this;
			--this.retrival;
			var worker = self.workers[self.rotation];
			worker.postMessage({
				imagedata : imagedata,
				width : width,
				height : height,
				frame: self.framenumber
			});
			++self.rotation;
			++self.framenumber;
			if(self.rotation == self.workers_lenght){
				self.rotation = 0;
			}
			
			/*
			if(dataURL.match("data:image/webp")){
				this.frames.push(dataURL);
			}else{
				--this.retrival;
				whm_worker.postMessage(dataURL);
			}
			*/
		}

		WhammyCrs.prototype.setFrameRate = function(framerate){
			this.framerate = framerate;
		}

		WhammyCrs.prototype.encodeWEBM = function(success){
			var self = this;
			this.interaval && clearInterval(this.interaval);
			this.interaval = null;
			this.progress && this.progress(0);
			function finish(){
				clearInterval(self.interaval);
				var blob = new Whammy.fromImageArray(self.frames, self.framerate);
				self.progress && self.progress(100);
				success(blob);
			}

			var time = 300;
			if(this.retrival < 0){
				var progresinit = -this.retrival;
				 this.interaval = setInterval(function(){
				 	self.progress && self.progress(((progresinit+self.retrival)/progresinit)*100);
					if(self.retrival >= 0){
						finish();
					}
				},time);
			}else{
				finish();
			}
		}

})();