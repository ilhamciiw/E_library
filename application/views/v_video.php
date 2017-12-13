<!DOCTYPE html>
<html>
<head>
    <title>File Video</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
        window.archive_setup = []
    </script>
    <script src="<?php echo base_url(); ?>assets/includes/jquery-1.10.2.min7a0c.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/analyticsefbc.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/bootstrap.minee7b.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/polyfill.minefbc.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/node_modules/react/dist/reacta5f5.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/node_modules/react-dom/dist/react-doma5f5.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/archive.minefbc.js" type="text/javascript"></script>
    <meta name="DESCRIPTION" content="Internet Archive is a non-profit digital library offering free universal access to books, movies & music, as well as 305 billion archived web pages." />
    <link rel="alternate" type="application/xml" title="RSS" href="services/collection-rss.php" />
    <script type="application/ld+json">
        {"@context":"http:\/\/schema.org","@type":"WebSite","name":"Internet Archive","alternateName":"Archive.org","url":"https:\/\/archive.org","potentialAction":{"@type":"SearchAction","target":"https:\/\/archive.org\/search.php?query={query}","query-input":"required name=query"}} </script>

    <link href="<?php echo base_url(); ?>assets/includes/archive.minefbc.css" rel="stylesheet" type="text/css" />
    <link rel="SHORTCUT ICON" href="<?php echo base_url(); ?>assets/images/glogo.jpg" />
</head>

<body class="navia top ia-module bgEEE lists showdetails">
    <a href="#maincontent" class="hidden-for-screen-readers">Skip to main content</a>

    <!-- Wraps all page content -->
    <div id="wrap">

        <div id="navwrap1">
            <div id="navwrap2">

                <div class="navbar navbar-inverse navbar-static-top" role="navigation">
                    <div id="nav-tophat-helper" class="hidden-xs" style="color:blue;"></div>
                    <ul class="nav navbar-nav navbar-main">
                        

                        <li class="navbar-brand-li">
                            <a class="navbar-brand" href="<?php echo base_url() ?>index.php/welcome" target="_top"><img src="<?php echo base_url(); ?>assets/images/yapi.png" alt="logo yapi" style="width:40x;height:40px;"></a>
                        </li>

                        <li class="nav-hamburger dropdown dropdown-ia pull-right hidden-sm hidden-md hidden-lg">
                            <div class="container-fluid">
                                <div class="navbar-header">
                                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-hamburger-menu" aria-expanded="false">
                                        <span class="sr-only">Toggle navigation</span>
                                        <span class="icon-bar"></span>
                                        <span class="icon-bar"></span>
                                        <span class="icon-bar"></span>
                                    </button>
                                    
                                    <!-- /.navbar-collapse -->
                                </div>
                            </div>
                            <!-- /.container-fluid -->
                        </li>

                    
                        <li class="dropdown dropdown-ia pull-right">
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Upload
                                 <span class="caret"></span></button>
                                 <ul class="dropdown-menu">
                                   <li><a href="<?php echo base_url() ?>index.php/crud_upload">Buku</a></li>
                                   <li><a href="<?php echo base_url() ?>index.php/crud_upload1">Video</a></li>
                                    <li><a href="#">Audio</a></li>
                                    <li><a href="#">Foto</a></li>
                               </ul>
                              </div>
                            </li>

                        <li class="dropdown dropdown-ia pull-right">
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Admin
                                 <span class="caret"></span></button>
                                 <ul class="dropdown-menu">
                                   <li><a href="<?php echo base_url() ?>index.php/admin/list_user">Data User</a></li>
                                   <li><a href="<?php echo base_url() ?>index.php/login/logout">Log Out</a></li>
                                    
                               </ul>
                              </div>
                        </li>

                    </ul>

					
                    
                </div>
                <!--/.navbar-->

            </div>
            <!--#navwrap1-->
        </div>

        <h2>Daftar Video</h2>

        <div style="padding-top:10px;">
                        <div class="searchbar" style="margin-bottom:10px; margin-right:1000px;">
                            <form class="form search-form js-search-form" id="searchform" method="get" role="form" action="https://archive.org/searchresults.php" data-wayback-machine-search-url="https://web.archive.org/web/*/">
                                <div class="form-group" style="position:relative">
                                    <div style="position:relative">
                                        <label for="search-bar-1" class="sr-only">Search the Archive</label>
                                        <span class="iconochive-search" style="position:absolute;left:4px;top:7px;color:#999;font-size:125%" aria-hidden="true"></span><span class="sr-only">search</span>
                                        <input id="search-bar-1" class="form-control input-sm roundbox20 js-search-bar" size="25" name="search" placeholder="Search" type="text" value="" style="font-size:125%;padding-left:30px;" onclick="$(this).css('padding-left','').parent().find('.iconochive-search').hide()" />
                                    </div>
                                    <button class="btn btn-gray label-primary input-sm" style="position:absolute;right:-60px;top:0;" type="submit">GO</button>
                                    <input type="hidden" name="limit" value="100" />
                                    <input type="hidden" name="start" value="0" />
                                    <input type="hidden" name="searchAll" value="yes" />
                                    <input type="hidden" name="submit" value="this was submitted" />

                                </div>
                                <!--/.form-group -->
                            </form>
                        </div>
                        <!--/.searchbar-->
                    </div>

                    <br> </br>

        <div class="row">

            <div class="col-lg-4 col-md-6 mb-4">
              <div class="card h-100">
                <a href="#"><img class="card-img-top" src="http://placehold.it/300x300" alt=""></a>
                <div class="card-body">
                  <h4 class="card-title">
                    <a href="#">Item One</a>
                  </h4>
                  <h5>$24.99</h5>
                  <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>
                </div>
                <div class="card-footer">
                  <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4">
              <div class="card h-100">
                <a href="#"><img class="card-img-top" src="http://placehold.it/300x300" alt=""></a>
                <div class="card-body">
                  <h4 class="card-title">
                    <a href="#">Item Two</a>
                  </h4>
                  <h5>$24.99</h5>
                  <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur! Lorem ipsum dolor sit amet.</p>
                </div>
                <div class="card-footer">
                  <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 mb-4">
              <div class="card h-100">
                <a href="#"><img class="card-img-top" src="http://placehold.it/300x300" alt=""></a>
                <div class="card-body">
                  <h4 class="card-title">
                    <a href="#">Item Three</a>
                  </h4>
                  <h5>$24.99</h5>
                  <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur!</p>
                </div>
                <div class="card-footer">
                  <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9734;</small>
                </div>
              </div>
            </div>