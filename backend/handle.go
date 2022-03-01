package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type jsonObj_VirtualMachine struct {
	ID         int    `json:"id" binding:"required"`
	Status     string `json:"status"`
	IP         string `json:"ip"`
	Decription string `json:"description"`
}

// We'll create a list of fack VM
var VMs = []jsonObj_VirtualMachine{
	jsonObj_VirtualMachine{1, "stop", "10.10.10.1", "x10 firmware 2021-07-13"},
	jsonObj_VirtualMachine{2, "stop", "10.10.10.2", "x11 firmware 2021-08-13"},
	jsonObj_VirtualMachine{3, "stop", "10.10.10.3", "x12 firmware 2021-09-13"},
	jsonObj_VirtualMachine{4, "stop", "10.10.10.4", "x13 firmware 2021-10-13"},
}

// testHandler retrieves a list of available VMs
func testHandler(c *gin.Context) {
	c.Header("access-control-allow-origin", "*")
	c.JSON(http.StatusOK, gin.H{
		"message": "test handler not implemented yet",
	})
}

// Start the vm with the ID
func startVMwithID(ctx *gin.Context) {

	//Parse the VM_ID from route
	if VM_ID, err := strconv.Atoi(ctx.Param("VM_ID")); err == nil {
		// find the specifict vm and change the status of VM into running.
		for i := 0; i < len(VMs); i++ {
			if VMs[i].ID == VM_ID {
				VMs[i].Status = "running"
			}
		}
		//Set the Access-control-allow to prevent the CORS Policy block the http request
		//these code can be deleted or edited after implement with TLS
		ctx.Header("Access-Control-Allow-Origin", "*")

		// return a pointer to the updated VM list
		ctx.JSON(http.StatusOK, &VMs)
	} else {
		// VM ID is invalid
		ctx.AbortWithStatus(http.StatusNotFound)
	}
}

// Get the vm info with the ID
func getVMInfoWithID(ctx *gin.Context) {

	//Parse the VM_ID from route
	if VM_ID, err := strconv.Atoi(ctx.Param("VM_ID")); err == nil {
		//Set the Access-control-allow to prevent the CORS Policy block the http request
		//these code can be deleted or edited after implement with TLS
		ctx.Header("Access-Control-Allow-Origin", "*")

		// return a pointer to the updated VM list
		ctx.JSON(http.StatusOK, &VMs[VM_ID-1])
	} else {
		// VM ID is invalid
		ctx.AbortWithStatus(http.StatusNotFound)
	}
}
