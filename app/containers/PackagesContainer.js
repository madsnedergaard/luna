/**
* Packages Container Component
**/
'use strict';

import {remote, ipcRenderer} from 'electron';
import React from 'react';
import {parse} from '../utils';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions';
import {modes} from '../constants/Modes';

import PackagesListHeader from '../components/packages/PackagesListHeader';
import PackagesListSearch from '../components/packages/PackagesListSearch';
import PackagesList from '../components/packages/PackagesList';
import PackageContainer from '../containers/PackageContainer';

class PackagesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this._setupList = this._setupList.bind(this);
    this._setupOutdated = this._setupOutdated.bind(this);
  }
  _setupList(packages) {
    let packagesData = parse(packages, 'dependencies');

    this.props.setPackages(packagesData);
    this.props.setTotalInstalled(packagesData.length);
    this.props.toggleLoader(false);

    //notifications
    let notifications = parse(packages, 'problems');
    if(!notifications.length) {
      this.props.clearMessages();
      this.props.setPackagesOutdated([]);
      return;
    }
    notifications.forEach((notification, idx) => {
      if (typeof notification === 'string') {
        this.props.addMessage('error', notification);
      }
    });
  }
  _setupOutdated(packages) {
    if (!packages) {
      this.props.setPackagesOutdated([]);
      return;
    }
    let outdatedData = JSON.parse(packages);
    this.props.setPackagesOutdated(outdatedData);
    this.props.toggleLoader(false);
  }
  loadData() {
    this.props.setActive(null);
    this.props.toggleLoader(true);
    this.props.toggleMainLoader(false);
    ipcRenderer.send('ipc-event', {
      ipcEvent: 'get-packages',
      cmd: ['list', 'outdated'],
      mode: this.props.mode,
      directory: this.props.directory
    });
  }
  componentDidMount() {
    // npm list && npm outdated
    this.loadData();

    // npm list && npm outdated listener
    ipcRenderer.on('get-packages-close', (event, packages, command) => {
      if(!packages) {
        return;
      }
      switch (command) {
        case 'outdated':
          this._setupOutdated(packages);
          break;
        default:
          this._setupList(packages);
      }
    });

    // npm search listener
    ipcRenderer.on('search-packages-close', (event, packagesStr) => {
      let packages = JSON.parse(packagesStr);
      this.props.setPackages(packages);
      this.props.toggleLoader(false);
    });

    // npm view listener
    ipcRenderer.on('view-package-close', (event, packageStr) => {
      let pkg;
      try {
        pkg = JSON.parse(packageStr);
      } catch (e) {
        console.error(e);
      }

      if (pkg) {
        this.props.setActive(pkg, false);
      } else {
        throw new Error('Package cannot be parsed');
      }
    });

    //npm install | uninstall | update listener
    ipcRenderer.on('action-close', (event, pkg) => {
      this.loadData();
    });
  }
  componentWillUnMount() {
    ipcRenderer.removeAllListeners([
      'get-packages-close',
      'search-packages-close',
      'action-close',
      'view-package-reply'
    ]);
  }
  render() {
    let props = this.props;
    return (
        <div className="packages">
          <div className="row">
            <div className="col-lg-4 col-md-4">
              <PackagesListHeader
                mode={props.mode}
                directory={props.directory}
                total={props.packages.length}
                loadData={this.loadData}
                setMode={props.setMode}
                setActive={props.setActive}
                toggleLoader={props.toggleLoader}
              />
              <PackagesListSearch
                setActive={props.setActive}
                toggleLoader={props.toggleLoader}
                setMode={props.setMode}
                mode={props.mode}
                directory={props.directory}
                setPackageActions={props.setPackageActions}
              />
              <PackagesList
                mode={props.mode}
                directory={props.directory}
                loading={props.loading}
                packages={props.packages}
                toggleLoader={props.toggleLoader}
                toggleMainLoader={props.toggleMainLoader}
              />
            </div>
            <div className="col-lg-8 col-md-8">
              <PackageContainer active={props.active}/>
            </div>
          </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    mode: state.global.mode,
    directory: state.global.directory,
    loading: state.global.loading,
    packages: state.packages.packages,
    active: state.packages.active
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setPackages:(packages)=>{
      return dispatch(actions.setPackages(packages));
    },
    setPackageActions:(packageActions)=>{
      return dispatch(actions.setPackageActions(packageActions));
    },
    setActive:(pkg)=> {
      return dispatch(actions.setActive(pkg));
    },
    toggleLoader:(bool)=> {
      return dispatch(actions.toggleLoader(bool))
    },
    toggleMainLoader:(bool)=> {
      return dispatch(actions.toggleMainLoader(bool))
    },
    setMode:(mode)=> {
      return dispatch(actions.setMode(mode))
    },
    setPackagesOutdated:(packages)=> {
      return dispatch(actions.setPackagesOutdated(packages));
    },
    setTotalInstalled:(total)=>{
      return dispatch(actions.setTotalInstalled(total));
    },
    addMessage:(level, message)=>{
      return dispatch(actions.addMessage(level, message));
    },
    clearMessages:()=>{
      return dispatch(actions.clearMessages())
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackagesContainer);
