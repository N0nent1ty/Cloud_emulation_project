package main

import (
	"net/http"
	"os"

	"github.com/chengjoey/web-terminal/views"
	"github.com/gin-gonic/gin"
)

var (
	EnvGOPATH = os.Getenv("GOPATH")
	//	TemplateFiles = fmt.Sprintf("%s/src/github.com/chengjoey/web-terminal/templates/*.html", EnvGOPATH)
	//	StaticFiles   = fmt.Sprintf("%s/src/github.com/chengjoey/web-terminal/templates/static", EnvGOPATH)
	TemplateFiles = "./templates/*.html"
	StaticFiles   = "./templates/static"
)

//deal with any Json error
func JSONAppErrorReporter() gin.HandlerFunc {
	return jsonAppErrorReporterT(gin.ErrorTypeAny)
}

func jsonAppErrorReporterT(errType gin.ErrorType) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
		detectedErrors := c.Errors.ByType(errType)
		if len(detectedErrors) > 0 {
			err := detectedErrors[0].Err
			var parsedError *views.ApiError
			switch err.(type) {
			//If the generated error is a custom structure, convert the error and return the custom code and msg
			case *views.ApiError:
				parsedError = err.(*views.ApiError)
			default:
				parsedError = &views.ApiError{
					Code:    http.StatusInternalServerError,
					Message: err.Error(),
				}
			}
			c.IndentedJSON(parsedError.Code, parsedError)
			return
		}

	}
}

//Deal with Cross-Origin Resource Sharing problem
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	server := gin.Default()
	server.LoadHTMLGlob(TemplateFiles)
	server.Static("/static", StaticFiles)
	server.Use(JSONAppErrorReporter())
	server.Use(CORSMiddleware())
	server.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	server.GET("/ws", views.ShellWs)
	server.Run(":5001")
}
