needs(jsonlite)
needs(GEOquery)

suppressWarnings(suppressMessages({
  returnValue <- list()
  returnValue$saveValue <- tryCatch(
    withCallingHandlers(
      {
        input = fromJSON(input[[1]])
        id = gsub(" ","",input$gsecode,fixed=TRUE)

        gds <- getGEO(id, GSEMatrix = F,getGPL=T,AnnotGPL=T)
        mytable=matrix("",length(GSMList(gds)),3)
        colnames(mytable)=c("gsm","title","description")
        for (k in 1:length(GSMList(gds)))
        {
          if (is.null(Meta(GSMList(gds)[[k]])$description)) {    
            mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], 'No data available')
          } else {
            mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], Meta(GSMList(gds)[[k]])$description[1])
          }
        }

        list(files=as.data.frame(apply(mytable,c(1,2),utils::URLencode)),tableOrder=colnames(mytable))
      },
      message=function(m) {
        print(m$message)
      },
      warning=function(w) {
        returnValue$warnings <<- append(returnValue$warnings, w$message)
      }
    ),
    error=function(e) {
      returnValue$error <<- list(
        status = FALSE,
        statusMessage = e$message
      )
      return(NULL)
    }
  )
}))
toJSON(returnValue, auto_unbox = T)
