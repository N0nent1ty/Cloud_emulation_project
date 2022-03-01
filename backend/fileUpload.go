package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func saveFileHandler(ctx *gin.Context) {
	file, err := ctx.FormFile("file")

	// The file cannot be received.
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "No file is received",
		})
		return
	}

	//===========================================================================
	//If you don't want the upload file rewrite the old one, uncomment this filed
	//& remember to import    "github.com/google/uuid" // To generate random file names
	// Retrieve file information
	//extension := filepath.Ext(file.Filename)
	// Generate random file name for the new uploaded file so it doesn't override the old file with same name
	//newFileName := uuid.New().String() + extension
	//============================================================================
	// The file is received, so let's save it

	if err := ctx.SaveUploadedFile(file, "/share/Cloud_service_firmware_Upload/"+file.Filename); err != nil {

		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to save the file",
		})
		return
	}

	ctx.Header("Access-Control-Allow-Origin", "*")
	// File saved successfully. Return proper result
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Your file has been successfully uploaded.",
	})
}
