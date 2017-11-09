/**
* Sidebar container
**/

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UI } from '../constants/UI';
import * as actions from '../actions';
import QuickMenu from '../components/sidebar/QuickMenu';
import Analyze from '../components/sidebar/Analyze';
import Settings from '../components/sidebar/Settings';
import OutdatedList from '../components/sidebar/OutdatedList';

class SidebarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.handleSidebarContent = this.handleSidebarContent.bind(this);
  }
  handleSidebarContent(idx) {
    let sidebarContent = this.refs.sidebarContent;
    let menus = sidebarContent.querySelectorAll('.sidebar__menu');

    for (let i = 0; i < menus.length; i++) {
      menus[i].classList.remove('active');
    }

    if(menus && menus[idx]) {
      menus[idx].classList.add('active');
      menus[0].style['margin-left'] = '-'+idx*menus[idx].offsetWidth+'px';
    }
  }
  render() {
    let props = this.props;
    let items = UI.itemIcons;
    return (
      <div className="sidebar">
        <QuickMenu
          items={items}
          handleSidebarContent={this.handleSidebarContent}
          packagesOutdated={props.packagesOutdated}
        />
        <div className="scroll-wrapper scrollable" style={{position: 'relative'}}>
            <div className="scrollable scroll-content">
              <div className="sidebar__cont" ref="sidebarContent">
                <div className="sidebar__menu active">
                  <Analyze
                    mode={props.mode}
                    toggleLoader={props.toggleLoader}
                    setMode={props.setMode}
                    setActive={props.setActive}
                    setPackagesOutdated={props.setPackagesOutdated}
                    packagesOutdated={props.packagesOutdated}
                    packagesInstalled={props.packagesInstalled}
                    clearMessages={props.clearMessages}
                    setTotalInstalled={props.setTotalInstalled}
                    setPackageActions={props.setPackageActions}
                  />
                </div>
                <div className="sidebar__menu">
                  <OutdatedList
                    mode={props.mode}
                    packages={props.packagesOutdated}
                    toggleMainLoader={props.toggleMainLoader}
                    setActive={props.setActive}
                  />
                </div>
                <div className="sidebar__menu">
                  <Settings
                    mode={props.mode}
                    setMode={props.setMode}
                    toggleLoader={props.toggleLoader}
                    setActive={props.setActive}
                    clearMessages={props.clearMessages}
                  />
                </div>
              </div>
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
    messages: state.global.messages,
    packages: state.packages.packages,
    packagesInstalled: state.packages.totalInstalled,
    packagesOutdated: state.packages.packagesOutdated
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setPackages: (packages) => {
      return dispatch(actions.setPackages(packages));
    },
    setPackageActions: (packageActions) => {
      return dispatch(actions.setPackageActions(packageActions));
    },
    setActive: (pkg) => {
      return dispatch(actions.setActive(pkg));
    },
    toggleLoader: (bool) => {
      return dispatch(actions.toggleLoader(bool))
    },
    toggleMainLoader: (bool) => {
      return dispatch(actions.toggleMainLoader(bool))
    },
    setMode: (mode, directory = null, loading = true) => {
      return dispatch(actions.setMode(mode, directory, loading))
    },
    setPackagesOutdated: (packages) => {
      return dispatch(actions.setPackagesOutdated(packages));
    },
    setTotalInstalled: (total) => {
      return dispatch(actions.setTotalInstalled(total));
    },
    addMessage: (level, message) => {
      return dispatch(actions.addMessage(level, message));
    },
    clearMessages: () => {
      return dispatch(actions.clearMessages())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer)
