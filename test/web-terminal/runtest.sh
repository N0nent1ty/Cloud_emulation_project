curl --output -include \
      	--no-buffer \
     	--header "Connection: Upgrade" \
   	--header "Upgrade: websocket" \
   	--header "Host: 127.0.0.1:3000"\
  	--header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ=="  \
    	--header "Sec-WebSocket-Version: 13" \
    	  http://127.0.0.1:5001/socket.io?msg=eyJ1c2VybmFtZSI6InJvb3QiLCAiaXBhZGRyZXNzIjoiMTI3LjAuMC4xIiwgInBvcnQiOjIyLCAicGFzc3dvcmQiOiIxMjM0NTYifQ==
