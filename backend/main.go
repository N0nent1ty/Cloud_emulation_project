package main

import (
	"io"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

// VM contented with the following feature

func main() {

	//==========================================================
	//fake go rutine to emulate the machine state change
	//==========================================================

	//fake schedule to change the internal state every few second.
	funcFakeCGState := func() {
		for i := 0; i < len(VMs); i++ {
			VMs[i].Status = "stop"
		}

	}
	stop := schedule(funcFakeCGState, 15*time.Second)

	//==============================================================
	//Gin routing table and handle request
	//==============================================================
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "successAccess",
			})
		})
	}

	api.POST("/vm/start/:VM_ID", startVMwithID)
	api.POST("/vm/getinfo/:VM_ID", getVMInfoWithID)
	//get rid off the CORS problem(should be fix in future)
	router.Use(cors.Default())

	//===========================================================
	//Handle file(firmware upload)
	//===========================================================
	api.POST("/vm/savefile/:VM_ID", saveFileHandler)

	//===========================================================
	//SSE experiments
	//===========================================================

	router.GET("/stream", func(c *gin.Context) {
		chanStream := make(chan int, 10)
		go func() {
			defer close(chanStream)
			//send somehing to clinet here example:
			for i := 0; i < 1000000; i++ {
				chanStream <- i
				time.Sleep(time.Second * 1)
			}
		}()
		c.Stream(func(w io.Writer) bool {
			if msg, ok := <-chanStream; ok {
				c.SSEvent("message", msg)
				return true
			}
			return false
		})
	})

	router.Use(static.Serve("/", static.LocalFile("./public", true)))

	// Start and run the server
	router.Run(":4000")

	//stop the change state rutine
	stop <- true
}
