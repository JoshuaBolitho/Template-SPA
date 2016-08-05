import config from 'config/Config';
import DeviceDetect from 'utils/DeviceDetect';
import Model from 'core/Model';
import Router from 'core/Router';
import SectionsController from 'core/SectionsController';
import Menu from 'ui/DefaultMenu';

class App {


    constructor () {

       this.bootStart = Date.now();
       
       console.log('APP CONSTRUCTOR');
       console.log('- begin boot:', this.bootStart, 'ms'); 
    }


    /*************************************************
    ** 
    ** create all the pre-data dependencies
    **
    *************************************************/

    boot () {

       // Description of the clients' environment
       this.deviceDetect = new DeviceDetect();

       // populate main data model, which describes the application structure
       this.model = new Model();
       this.model.loadJSON(config.json_url, this.bootContinued.bind(this));
    }


    /*************************************************
    **
    ** now create data dependent classes
    **
    *************************************************/

    bootContinued () {

        this.router = new Router(this.model.sections);
        this.router.on('SectionChange', this.on_SECTION_CHANGE.bind(this));

        this.sectionsController = new SectionsController(this.model.sections);
        this.sectionsController.changeSection(this.router.getRoute());

        this.menu = new Menu(this.model.sections, this.router.getRoute());
        this.menu.on('SectionSelect', this.router.navigate.bind(this.router));

        // passed manually to children: top to bottom.
        window.addEventListener('resize', this.on_RESIZE.bind(this));
    }


    /*************************************************
    ** 
    ** When router announces a section change. Should
    ** not be called directly, unless the intent is
    ** to bypass recording browser state.
    **
    *************************************************/

    on_SECTION_CHANGE (section) {
        this.sectionsController.changeSection(section);
        this.menu.setSection(section);
    }


    /*************************************************
    **  
    **  Top level resize
    **
    *************************************************/

    on_RESIZE (e) {

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.sectionsController.resize(this.width, this.height);
        this.menu.resize(this.width, this.height);
    }
}

var ROOT = new App();
ROOT.boot();