import { FaTag, FaSyncAlt, FaBriefcase, FaUpload } from 'react-icons/fa'; // Import necessary icons
import transcription from "../../assets/transcription.jpeg"
import Footer from '@/components/layout/footer/Footer';
const ResyncAI = () => {
    return (
        <div className=''>
            <section>
                <div className="max-w-screen-xl mx-auto md:p-0 p-3">
                    {/* Introduction Section */}
                    <section className="text-white md:px-4 text-center py-12 flex justify-center items-center  flex-col">
                        <div className='flex gap-10 w-full justify-between items-center md:flex-row flex-col  md:text-left'>
                            <div className=' md:w-1/2'>
                                <p className="text-xl  mt-6 max-w-4xl md:text-3xl font-bold">
                                    Captioned Video for Government Compliance and Student Access and Inclusion

                                </p>
                                <p className="text-base md:text-lg mt-4 max-w-4xl">
                                    Complementing our high-quality real-time human stenocaptioning and transcription services, our captioned video service ensures that communication remains accessible to all. Our comprehensive suite of accessibility services significantly improves the lives of not only Deaf and hard of hearing individuals but other individuals who benefit from text and captions, such as those with English as a second language and/or those with hidden disabilities such as auditory processing disorders.

                                </p>

                            </div>
                            <img src={transcription} alt="Onsite CART" className="mx-auto md:w-1/2 rounded-2xl max-h-[470px] object-cover" />

                        </div>

                    </section>

                    {/* Features Section */}
                    <section className="text-white md:px-4 text-center py-12 flex justify-center items-center flex-col">
                        <h2 className="text-2xl md:text-3xl font-bold">Key Features</h2>
                        <div className="flex flex-wrap mt-10 gap-10 justify-center">

                            {/* Easy-to-Use Platform */}
                            <div className="space-y-1 hover:translate-y-4 cursor-pointer duration-300 max-w-[450px] md:max-h-[240px] bg-slate-900 px-4 md:px-10 py-6 rounded-3xl">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="bg-[#A100FF] rounded-full w-10 h-10 flex justify-center items-center">
                                        <FaUpload className="text-white" />
                                    </span>
                                    <h3 className="text-xl font-semibold">Easy-to-Use Platform</h3>
                                </div>
                                <p className="text-sm md:text-base">
                                    Users can upload files, select their desired services and receive high-quality results in just a few clicks. Pay only for what you need.

                                </p>
                            </div>

                            {/* Ideal for Legal, Corporate, and Media Use */}
                            <div className="space-y-1 hover:translate-y-4 cursor-pointer duration-300 max-w-[450px] md:max-h-[240px] bg-slate-900 px-4 md:px-10 py-6 rounded-3xl">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="bg-[#A100FF] rounded-full w-10 h-10 flex justify-center items-center">
                                        <FaBriefcase className="text-white" />
                                    </span>
                                    <h3 className="text-xl font-semibold">Ideal for Legal, Corporate, and Media Use</h3>
                                </div>
                                <p className="text-sm md:text-base">
                                    Ideal for students, legal and corporate. Captify.live’s state-of-the-art AI tools enhance accessibility, streamline workflows and reduce manual effort.

                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us Section */}
                    <section className="text-white md:px-4 text-center py-12 flex justify-center items-center flex-col">
                        <h2 className="text-2xl md:text-3xl font-bold">Why Choose Us</h2>
                        <div className="flex flex-wrap mt-10 gap-10 justify-center">

                            {/* Cost-Effective Beta Offering */}
                            <div className="space-y-1 hover:translate-y-4 cursor-pointer duration-300 max-w-[450px] md:max-h-[240px] bg-slate-900 px-4 md:px-10 py-6 rounded-3xl">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="bg-[#A100FF] rounded-full w-10 h-10 flex justify-center items-center">
                                        <FaTag className="text-white" />
                                    </span>
                                    <h3 className="text-xl font-semibold">Cost Effective
                                    </h3>
                                </div>
                                <p className="text-sm md:text-base">
                                    We offer low-cost solutions, instant pay per use and no subscription fees. Our services are all about reducing manual effort and costs.
                                </p>
                            </div>

                            {/* Accurate Syncing */}
                            <div className="space-y-1 hover:translate-y-4 cursor-pointer duration-300 max-w-[450px] md:max-h-[240px] bg-slate-900 px-4 md:px-10 py-6 rounded-3xl">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="bg-[#A100FF] rounded-full w-10 h-10 flex justify-center items-center">
                                        <FaSyncAlt className="text-white" />
                                    </span>
                                    <h3 className="text-xl font-semibold">Accurate Captions
</h3>
                                </div>
                                <p className="text-sm md:text-base">
                                    Our services are designed for speed, accuracy and efficiency.
                                </p>
                            </div>

                            {/* Multiple Use Cases */}
                            <div className="space-y-1 hover:translate-y-4 cursor-pointer duration-300 max-w-[450px] md:max-h-[240px] bg-slate-900 px-4 md:px-10 py-6 rounded-3xl">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="bg-[#A100FF] rounded-full w-10 h-10 flex justify-center items-center">
                                        <FaBriefcase className="text-white" />
                                    </span>
                                    <h3 className="text-xl font-semibold">Simple Upload and Download Process
</h3>
                                </div>
                                <p className="text-sm md:text-base">
                                   Upload your audio/video files and receive an instant and accurate transcript.
                                </p>
                            </div>

                            {/* Simple Upload and Download Process */}
                         
                        </div>
                    </section>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default ResyncAI;
