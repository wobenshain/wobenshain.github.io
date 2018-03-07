library(GEOquery)
library(pd.mogene.2.0.st)
library(mogene20sttranscriptcluster.db)
library(pd.hg.u133.plus.2)
library(hgu133plus2.db)
library(pd.hugene.2.0.st)
library(hugene20sttranscriptcluster.db)
library(pd.clariom.s.human.ht)
library(clariomshumanhttranscriptcluster.db)
library(pd.clariom.s.human)
library(clariomshumantranscriptcluster.db)
library(pd.clariom.s.mouse.ht)
library(clariomsmousehttranscriptcluster.db)
library(pd.clariom.s.mouse)
library(clariomsmousetranscriptcluster.db)
library(pd.mouse430.2)
library(mouse4302.db)
library(pd.hg.u133a)
library(hgu133a.db)
library(pd.hugene.1.0.st.v1)
library(hugene10sttranscriptcluster.db)
library(pd.mogene.1.0.st.v1)
library(mogene10sttranscriptcluster.db)
library(pd.hg.u133a.2)
library(hgu133a2.db)
library(pd.huex.1.0.st.v2)
library(huex10sttranscriptcluster.db)   
library(pd.hg.u219)
library(hgu219.db)
library(pd.mg.u74av2)
library(mgu74av2.db)
library(pd.mouse430a.2)
library(mouse430a2.db)
library(pd.moe430a)
library(moe430a.db)
library(pd.hg.u95av2)
library(hgu95av2.db)
library(pd.hta.2.0)
library(hta20transcriptcluster.db)
library(pd.moex.1.0.st.v1)
library(moex10sttranscriptcluster.db)
library(pd.hg.u133b)
library(hgu133b.db)
library(pd.hugene.1.1.st.v1)
library(hugene11sttranscriptcluster.db)
library(pd.mogene.1.1.st.v1)
library(mogene11sttranscriptcluster.db)
library(limma)
library(oligo)
library(gplots)
library(geneplotter)
library(multtest)
library(rgl)
library(rglwidget)
library(DT)
library(getopt)
library(annotate)
library(knitr)
library(reshape)
library(RColorBrewer)
library(mixOmics)
library(calibrate)
library(rmarkdown)
library(ggplot2)
library(ggfortify)
library(shinyRGL)
library(plotly)
library(htmltools)
library(heatmaply)
library(Biobase)
library(GSVA)
library(GSEABase)
library(pheatmap)
library(viridis)
library(dendsort)


raw <- function(input) {
  id=input$gseid

  if (id=='8 digit GSE code') {
    cels = input$filenames
    Pheno=matrix("",length(cels),1)
    colnames(Pheno)=c("title")
    for (k in 1:length(cels)) {
      Pheno[k,]<-c(cels[k])
    }
    Pheno <- data.frame(Pheno)
    Pheno$group <- "..."
    rownames(Pheno) = Pheno$title

    SampleName = input$filenames
    pd = AnnotatedDataFrame(Pheno)

    myfiles = paste(input$folder,input$filenames,sep="/")
    celfiles = read.celfiles(myfiles, phenoData = pd)
    colnames(pData(celfiles))[1] = 'SampleID'
  } else {
    # id = gsub(" ","",id,fixed=TRUE) 
    # system(paste0('rm *.[cC][eE][lL].gz'))        #removes previous CEL files
    # getGEOSuppFiles(id, makeDirectory = T, baseDir = getwd())
    # fileID = paste0(id, '_RAW.tar')
    # #system(paste0('tar -xvf', fileID))
    # untar(paste0(getwd(),'/',id,'/',fileID))
    # incProgress(0.25)
    
    # #cels = paste0(Pheno$gsm,'_',Pheno$title,'.CEL.gz')   #adds filename
    # Pheno = v$data
    # SampleName = list.files(pattern = '/*CEL.gz', ignore.case = T)    #list contents of new directory with zipped CEL files
    
    # if (length(grep('*CEL*',SampleName,ignore.case = T)) == 0) {
    #   info("Raw files must be CEL files")
    # }
    # rownames(Pheno) = Pheno$title
    # cels = SampleName
    
    # incProgress(0.25)
    
    # pd = AnnotatedDataFrame(Pheno)
    # celfiles = read.celfiles(cels, phenoData = pd)
    # colnames(pData(celfiles))[2] = 'SampleID'    
  }
  
  y<-paste("_",input$project_id, sep="")
  tAnnot = tempfile(pattern = "annotation_", tmpdir = getwd(), fileext = paste0(y,'.txt'))
  cat(celfiles@annotation,file=tAnnot)
  
  if (celfiles@annotation!="pd.hg.u133.plus.2" & celfiles@annotation!="pd.mogene.2.0.st" & celfiles@annotation!="pd.hugene.2.0.st" & celfiles@annotation!="pd.clariom.s.human.ht" & celfiles@annotation!="pd.clariom.s.human" & celfiles@annotation!="pd.clariom.s.mouse.ht" & celfiles@annotation!="pd.clariom.s.mouse" & celfiles@annotation!='pd.mouse430.2' & celfiles@annotation!='pd.hg.u133a' & celfiles@annotation!='pd.hugene.1.0.st.v1' & celfiles@annotation!='pd.mogene.1.0.st.v1' & celfiles@annotation!='pd.hg.u133a.2' & celfiles@annotation!='pd.huex.1.0.st.v2' & celfiles@annotation!='pd.hg.u219' & celfiles@annotation!='pd.mg.u74av2' & celfiles@annotation!='pd.mouse430a.2' & celfiles@annotation!='pd.moe430a' & celfiles@annotation!='pd.hg.u95av2' & celfiles@annotation!='pd.hta.2.0' & celfiles@annotation!='pd.moex.1.0.st.v1' & celfiles@annotation!='pd.hg.u133b' & celfiles@annotation!='pd.hugene.1.1.st.v1' & celfiles@annotation!='pd.mogene.1.1.st.v1') {
    info(paste0("Affymetrix platform: ",celfiles@annotation," NOT supported. Leaving..."))
    stopApp(-1)
  }

  celfiles
}

suppressWarnings(suppressMessages({
  returnValue <- list()
  returnValue$saveValue <- tryCatch(
    withCallingHandlers(
      {
        input = fromJSON(input[[1]])
        #user input: Project ID (cannot be NA)
        projectId = 'test'
        
        #user input: GSE number
        id = input$gseid
        if (id=='8 digit GSE code') {
          id = gsub(" ","",id,fixed=TRUE)  
          #gets meta data 
          gds <- getGEO(id, GSEMatrix = F,getGPL=T,AnnotGPL=T)
          
          #creates empty table
          mytable=matrix("",length(GSMList(gds)),3)
          colnames(mytable)=c("gsm","title","description")
          
          #Populates table with meta data
          # (For CEL file input, this table will have one column for CEL file name, 
          # an option would be to allow the user to select unique ids or upload a file assigning the samples to ids)
          for (k in 1:length(GSMList(gds)))
          {
            if (is.null(Meta(GSMList(gds)[[k]])$description)) {    
              mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], 'No data available')
            } else {
              mytable[k,] <-c(Meta(GSMList(gds)[[k]])$geo_accession[1], Meta(GSMList(gds)[[k]])$title[1], Meta(GSMList(gds)[[k]])$description[1])
            }
          }
        } else {
          #example of a way to process CEL files once they're uploaded:
          cels = upload_cel_files_here
          for (k in 1:length(cels))
          {
           mytable[k,]<-c(cels[k])
          }
          mytable <- data.frame(mytableCEL)
        }
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
