import React from 'react'
import {Route, Redirect} from 'react-router'
import DefaultTemplate from '../templates/default_tmpl'
import HomePageRouter from '../containers/homePage/homePage.routes'
import ClassroomPageRouter from '../containers/classroomPage/classroomPage.routes'
import AboutPageRouter from '../containers/aboutPage/aboutPage.routes'
import VideoPageRouter from '../containers/videoPage/videoPage.routes'
import ParentResourceRouter from '../containers/parentResources/parentResourcePage.routes'
import ContactRouter from '../containers/contact/contactPage.routes'
import TuitionRouter from '../containers/tuitionPage/tuitionPage.routes'
import FieldTripRouter from '../containers/fieldTripPage/fieldTripPage.routes'
import MonthlyThemesRouter from '../containers/monthlyThemes/monthlyThemesPage.routes'
import MenuRouter from '../containers/menuPage/menuPage.routes'
import SampleLessonRouter from '../containers/sampleLessonPage/sampleLessonPage.routes'

export default (
    <Route component={DefaultTemplate}>

        <Route path="/">
            {/*{HomePageRouter}*/}
        </Route>
        {/*{ClassroomPageRouter}*/}
        {/*{AboutPageRouter}*/}
        {/*{VideoPageRouter}*/}
        {/*{ParentResourceRouter}*/}
        {/*{ContactRouter}*/}
        {/*{TuitionRouter}*/}
        {/*{FieldTripRouter}*/}
        {/*{MonthlyThemesRouter}*/}
        {/*{MenuRouter}*/}
        {/*{SampleLessonRouter}*/}
    </Route>
)
