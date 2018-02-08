needs(jsonlite)
needs(oligo)


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
        pData(raw(input))
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
