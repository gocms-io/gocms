'use strict';

import React from 'react';
import {connect} from 'react-redux'
import HeroImage from '../heroImage/HeroImage'


class BasicTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        let html = null;

        // mobile
        if (!!this.props.mobile) {

            let sections = [];
            for (let i = 0; i < this.props.rows.length; i++) {

                // set active row
                let r = this.props.rows[i];
                for (let j = 0; j < r.length; j++) {

                    // set active col
                    let c = r[j];

                    // if section title
                    if (i == 0 && j > 0) {
                        let section = {
                            title: c,
                            sections: []
                        };
                        sections.push(section);
                    }
                    // otherwise get data by skipping first col
                    else if (i > 0 && j > 0) {
                        sections[j - 1].sections.push({subTitle: r[0], data: r[j]});
                    }
                }
            }

            let dataCards = [];
            // build out mobile view
            for (let i = 0; i < sections.length; i++) {
                let sectionTitle = sections[i].title;
                let dataAry = sections[i].sections;
                let dataTable = [];
                // each dt dd pair
                for (let j = 0; j < dataAry.length; j++) {
                    dataTable.push(<dt key={j + "-dt"}>{dataAry[j].subTitle}</dt>);
                    dataTable.push(<dd key={j + "-dd"}>{dataAry[j].data}</dd>);
                }
                dataCards.push(
                    <div key={i} className="basic-table-mobile-row">
                        <h1 key={i+"-h1"}>{sectionTitle}</h1>
                        <dl key={i+"-dl"}>{dataTable}</dl>
                        {i == (sections.length-1) ? "" : <hr/>}
                    </div>
                );
            }
            html =
                <div className="basic-table-mobile">
                    {dataCards}
                </div>;
        }
        // desktop
        else {
            let tblHeader = null;
            let rowAry = [];

            for (let i = 0; i < this.props.rows.length; i++) {
                let r = this.props.rows[i];
                let colAry = [];
                // handle each col
                for (let j = 0; j < r.length; j++) {
                    colAry.push(
                        i == 0 ?
                            <th key={j} className={j == 0 ? "bold" : ""}>{r[j]}</th>
                            :
                            <td key={j}
                                className={j == 0 ? "bold archer font-size-16 font-style-normal" : ""}>{r[j]}</td>
                    );
                }

                if (i == 0) {
                    tblHeader =
                        <thead>
                        <tr>{colAry}</tr>
                        </thead>
                    ;
                }
                else {
                    rowAry.push(
                        <tr key={i}>{colAry}</tr>
                    )
                }
            }

            html =
                <table className={"basic-table " + this.props.className} key="desktop">
                    {tblHeader}
                    <tbody>{rowAry}</tbody>
                </table>;
        }
        return (html);
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, {})(BasicTable);