<?php 


class user extends CI_Controller{

	function __construct(){
		parent::__construct();		
		$this->load->model('m_data');
		$this->load->helper('url');

	}

	function index(){
		$this->load->view('v_user');
	}


	function tambah_aksi(){
		$id_buku = $this->input->post('id_buku');
		$judul_buku = $this->input->post('judul_buku');
		$isbn = $this->input->post('isbn');
		$pengarang = $this->input->post('pengarang');
		$tahun = $this->input->post('tahun');
 
		$data = array(
			'id_buku' => $id_buku,
			'judul_buku' => $judul_buku,
			'isbn' => $isbn,
			'pengarang' => $pengarang,
			'tahun' => $tahun
			);
		$this->m_data->input_data($data,'user');
		redirect('crud/index');
	}
}