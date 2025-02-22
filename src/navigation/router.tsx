import { Router, Route } from "preact-router"
import Home from "./pages/Home"
import Test from "./pages/test"

import { PestoProjectList } from './pages/projects/list.tsx';
import { PestoProjectDetail } from './pages/projects/details.tsx';
import { PestoContentTypeList } from './pages/content-types/list.tsx'
import { PestoContentTypeDetail } from './pages/content-types/details.tsx'
import { GithubLoginButton } from "./pages/login/github/GithubLoginButton.tsx";
import { MarkdownEditor } from "./pages/content/MarkDownEditor.tsx";
import About from "./pages/About.tsx";
import Pricing from "./pages/Pricing.tsx";
import Contact from "./pages/Contact.tsx";

export default function Layout(/*{ children }: { children: React.ReactNode }*/) {
    return (
        <>
            <Router>
                <Route path="/tests" component={Test} />
                <Route path="/" component={Home} />
                {
                    /**
                     * Projects
                     */
                }
                <Route path="/projects" component={PestoProjectList} />
                <Route path="/project/:project_id?" component={PestoProjectDetail} />
                {
                    /**
                     * Content Types
                     */
                }
                <Route path="/content-types" component={PestoContentTypeList} />
                <Route path="/content-type/:content_type_id_param?" component={PestoContentTypeDetail} />
                {
                    /**
                     * Content per Project
                     */
                }
                
                {
                    // <Route path="/project/:project_id?/content-mgmt" component={PestoProjectContentMgmtUI} />
                }

                {
                    // 
                    // <Route path="/projects" component={PestoProjectUI} />
                }
                {//https://github.com/preactjs/preact-router/issues/405#issuecomment-927369168

                }


                <Route path="/about" component={About} />
                <Route path="/pricing" component={Pricing} />
                <Route path="/contact" component={Contact} />

                <Route path="/editor" component={MarkdownEditor} />
                <Route path="/oauth/github/login" component={GithubLoginButton} />
            </Router>
        </>
    )
}

